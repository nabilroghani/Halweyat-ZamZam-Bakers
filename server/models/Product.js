import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ['Sweets', 'Cakes', 'Custom Cakes', 'Bakery Items', 'Fast Food', 'Nimko & Snacks', 'Drinks', 'Deals']
  },
  imageUrl: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 28 },
  unit: { type: String, default: 'Kg' }, // e.g. 'Kg', 'Lb', 'Box', 'Piece', 'Plate'
  weightOptions: [{ type: String }], // e.g. ['0.5 Kg', '1 Kg', '2 Kg'] or ['2 Lbs', '3 Lbs', '5 Lbs']
  tags: [{ type: String }], // e.g. ['Desi Ghee', 'Fresh', 'Special', 'Best Seller']
  prepTime: { type: String, default: '15-30 mins' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
