import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedOption: { type: String, default: '' }, // e.g. '1 Kg' or 'Chocolate Flavor'
  imageUrl: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Linked customer account
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, default: '' },
  orderType: { type: String, enum: ['Delivery', 'Pickup'], default: 'Pickup' },
  branch: { type: String, default: 'Timergara Main Branch' },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Counter Pickup', 'Online Transfer'], default: 'Cash on Delivery' },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  cancelReason: { type: String, default: '' },
  notes: { type: String, default: '' },
  isCustomCake: { type: Boolean, default: false },
  customCakeDetails: {
    flavor: String,
    weight: String,
    shape: String,
    toppingMessage: String,
    specialInstructions: String,
    referencePhotoUrl: String
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
