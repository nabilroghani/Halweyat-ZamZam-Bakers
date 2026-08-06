import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'halwiyat-zamzam',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_cloudinary_api_secret'
});

// @desc    Upload image file / base64 string to Cloudinary
// @route   POST /api/upload
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image data or file provided' });
    }

    // Upload base64 or URL data to Cloudinary bucket
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'halwiyat_zamzam_products',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed: ' + error.message });
  }
});

export default router;
