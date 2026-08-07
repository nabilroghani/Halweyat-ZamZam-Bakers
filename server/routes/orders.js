import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';
import { getIO } from '../socketInstance.js';
import { isValidPakistaniPhone, formatPakistaniPhone } from '../utils/validation.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

const router = express.Router();

const generateOrderId = () => {
  return `HZB-${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc    Create new customer order
// @route   POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, 
      customerPhone, 
      customerEmail,
      customerAddress, 
      orderType, 
      branch, 
      items, 
      totalAmount, 
      paymentMethod, 
      notes,
      isCustomCake,
      customCakeDetails,
      userId 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (customerPhone && !isValidPakistaniPhone(customerPhone)) {
      return res.status(400).json({ message: 'Please enter a valid Pakistani mobile number (e.g. 03275001166)' });
    }

    const formattedPhone = customerPhone ? formatPakistaniPhone(customerPhone) : '';

    const cleanedItems = items.map(it => ({
      product: (it.product && mongoose.Types.ObjectId.isValid(it.product)) ? it.product : null,
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      selectedOption: it.selectedOption || '',
      imageUrl: it.imageUrl || ''
    }));

    // Validate userId if provided (supports both MongoDB ObjectId and string IDs in fallback mode)
    let validUserId = null;
    if (userId) {
      if (mongoose.connection.readyState === 1) {
        validUserId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;
      } else {
        validUserId = userId.toString();
      }
    }

    const orderData = {
      orderId: generateOrderId(),
      userId: validUserId,
      customerName,
      customerPhone: formattedPhone || customerPhone,
      customerEmail: customerEmail || '',
      customerAddress: customerAddress || '',
      orderType: orderType || 'Pickup',
      branch: 'Timergara Main Branch',
      items: cleanedItems,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      notes: notes || '',
      isCustomCake: isCustomCake || false,
      customCakeDetails,
      createdAt: new Date().toISOString()
    };

    let createdOrderObj;

    if (mongoose.connection.readyState === 1) {
      const order = new Order(orderData);
      createdOrderObj = await order.save();
    } else {
      createdOrderObj = { _id: `ord-${Date.now()}`, ...orderData };
      inMemoryDB.orders.unshift(createdOrderObj);
    }

    // Trigger Nodemailer Order Receipt Email asynchronously
    sendOrderConfirmationEmail(createdOrderObj).catch(err => {
      console.error('Nodemailer background dispatch log:', err);
    });

    // 🔌 Real-time: Notify admin/receptionist of new order
    getIO().emit('new-order', createdOrderObj);

    return res.status(201).json(createdOrderObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged-in customer's order history (Strictly isolated by user account)
// @route   GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const userObjId = req.user._id;
    const userPhone = (req.user.phone && req.user.phone.length > 5 && req.user.phone !== '0300-0000000') ? req.user.phone : null;

    if (mongoose.connection.readyState === 1) {
      const orConditions = [{ userId: userObjId }];
      // Only match by phone if phone exists AND the order has no linked userId (unregistered guest order)
      if (userPhone) {
        orConditions.push({ customerPhone: userPhone, userId: null });
      }
      const orders = await Order.find({ $or: orConditions }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    // Fallback mode isolation
    const orders = inMemoryDB.orders.filter(o => {
      const isUserMatch = o.userId && (o.userId.toString() === userObjId?.toString());
      const isUnlinkedPhoneMatch = !o.userId && userPhone && (o.customerPhone === userPhone);
      return isUserMatch || isUnlinkedPhoneMatch;
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders (Admin / Receptionist only)
// @route   GET /api/orders
router.get('/', protect, authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    const { status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } }
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    }

    let filtered = [...inMemoryDB.orders];
    if (status && status !== 'All') {
      filtered = filtered.filter(o => o.status === status);
    }
    if (search) {
      filtered = filtered.filter(o => 
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search)
      );
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Track order by OrderID or Phone Number (public)
// @route   GET /api/orders/track/:query
router.get('/track/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query.toUpperCase().trim();

    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({
        $or: [
          { orderId: searchQuery },
          { customerPhone: req.params.query.trim() }
        ]
      }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    const orders = inMemoryDB.orders.filter(o => 
      o.orderId.toUpperCase() === searchQuery || o.customerPhone === req.params.query.trim()
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status (Admin / Receptionist only)
// @route   PATCH /api/orders/:id/status
router.patch('/:id/status', protect, authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    const { status, cancelReason } = req.body;

    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status provided' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.status = status;
      if (status === 'Cancelled' && cancelReason) {
        order.cancelReason = cancelReason;
      }
      const updatedOrder = await order.save();
      // 🔌 Real-time: Notify customers of order status change
      getIO().emit('order-status-updated', { _id: updatedOrder._id, orderId: updatedOrder.orderId, status: updatedOrder.status, cancelReason: updatedOrder.cancelReason });
      return res.json(updatedOrder);
    }

    const order = inMemoryDB.orders.find(o => o._id === req.params.id || o.orderId === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'Cancelled' && cancelReason) {
      order.cancelReason = cancelReason;
    }
    // 🔌 Real-time: Notify customers of order status change (fallback mode)
    getIO().emit('order-status-updated', { _id: order._id, orderId: order.orderId, status: order.status, cancelReason: order.cancelReason });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
