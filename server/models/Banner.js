import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
