import express from 'express';
import Product from '../models/Product.js';
import { sampleProducts } from '../data/seedData.js';

const router = express.Router();

// GET /api/products (with optional ?category= and ?featured= and ?search=)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Try DB first, fallback to in-memory seed data if DB is disconnected
    try {
      const products = await Product.find(query).sort({ createdAt: -1 });
      if (products && products.length > 0) {
        return res.json(products);
      }
    } catch (dbErr) {
      console.warn('MongoDB query failed, using in-memory fallback:', dbErr.message);
    }

    // In-memory filtering fallback for smooth preview without local DB setup required
    let filtered = [...sampleProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }
    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// POST /api/products (for admin or adding products)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

export default router;
