import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Cakes', 'Sweets', 'Fast Food', 'Bakery Items', 'Drinks']
  },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  unit: { type: String, default: 'piece' } // e.g., 'kg', 'piece', 'box', 'glass'
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
