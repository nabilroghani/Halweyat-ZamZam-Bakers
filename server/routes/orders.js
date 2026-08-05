import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';

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

    const orderData = {
      orderId: generateOrderId(),
      customerName,
      customerPhone,
      customerAddress: customerAddress || '',
      orderType: orderType || 'Pickup',
      branch: branch || 'Timergara Main Branch',
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      notes: notes || '',
      isCustomCake: isCustomCake || false,
      customCakeDetails,
      userId: userId || null,
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      const order = new Order(orderData);
      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    }

    const newOrder = { _id: `ord-${Date.now()}`, ...orderData };
    inMemoryDB.orders.unshift(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged-in customer's order history
// @route   GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ 
        $or: [
          { userId: req.user._id },
          { customerPhone: req.user.phone },
          { customerName: req.user.name }
        ] 
      }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    const orders = inMemoryDB.orders.filter(o => 
      o.userId === req.user._id || o.customerPhone === req.user.phone || o.customerName === req.user.name
    );
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

// @desc    Track order by OrderID or Phone Number
// @route   GET /api/orders/track/:query
router.get('/track/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query.toUpperCase();

    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({
        $or: [
          { orderId: searchQuery },
          { customerPhone: req.params.query }
        ]
      }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    const orders = inMemoryDB.orders.filter(o => 
      o.orderId.toUpperCase() === searchQuery || o.customerPhone === req.params.query
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
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.status = status;
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }

    const order = inMemoryDB.orders.find(o => o._id === req.params.id || o.orderId === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
