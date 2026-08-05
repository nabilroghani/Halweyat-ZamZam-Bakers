import express from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';

const router = express.Router();

// @desc    Fetch all categories
// @route   GET /api/categories
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
      return res.json(categories);
    }
    res.json(inMemoryDB.categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category (Admin only)
// @route   POST /api/categories
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, imageUrl, displayOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (mongoose.connection.readyState === 1) {
      const category = new Category({
        name,
        slug,
        description,
        imageUrl,
        displayOrder: displayOrder || 0
      });

      const createdCategory = await category.save();
      return res.status(201).json(createdCategory);
    }

    const newCat = { _id: `c-${Date.now()}`, name, slug, description, imageUrl, displayOrder: displayOrder || 0 };
    inMemoryDB.categories.push(newCat);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a category (Admin only)
// @route   DELETE /api/categories/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Category.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Category deleted successfully' });
    }

    inMemoryDB.categories = inMemoryDB.categories.filter(c => c._id !== req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
