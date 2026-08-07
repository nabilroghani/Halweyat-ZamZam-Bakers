import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';
import { getIO } from '../socketInstance.js';

const router = express.Router();

// @desc    Fetch all products with optional filters
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, availableOnly } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      if (featured === 'true') query.isFeatured = true;
      if (availableOnly === 'true') query.isAvailable = true;

      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.json(products);
    }

    // Fallback mode filtering
    let filtered = [...inMemoryDB.products];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.isFeatured);
    }
    if (availableOnly === 'true') {
      filtered = filtered.filter(p => p.isAvailable);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }

    const product = inMemoryDB.products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Product error' });
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, imageUrl, isFeatured, unit, weightOptions, tags } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const product = new Product({
        name,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice || 0),
        category,
        imageUrl,
        isFeatured: Boolean(isFeatured),
        unit: unit || 'Piece',
        weightOptions: weightOptions || [],
        tags: tags || []
      });
      const createdProduct = await product.save();
      // 🔌 Real-time: Notify all clients of new product
      getIO().emit('product-added', createdProduct);
      return res.status(201).json(createdProduct);
    }

    // Fallback mode creation
    const newProduct = {
      _id: `p-${Date.now()}`,
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice || 0),
      category,
      imageUrl,
      isFeatured: Boolean(isFeatured),
      isAvailable: true,
      rating: 5.0,
      reviewsCount: 1,
      unit: unit || 'Piece',
      weightOptions: weightOptions || [],
      tags: tags || ['New'],
      createdAt: new Date().toISOString()
    };
    inMemoryDB.products.unshift(newProduct);
    // 🔌 Real-time: Notify all clients of new product (fallback mode)
    getIO().emit('product-added', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      // 🔌 Real-time: Notify all clients of product update
      getIO().emit('product-updated', updatedProduct);
      return res.json(updatedProduct);
    }

    const idx = inMemoryDB.products.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });

    inMemoryDB.products[idx] = { ...inMemoryDB.products[idx], ...req.body };
    // 🔌 Real-time: Notify all clients of product update (fallback mode)
    getIO().emit('product-updated', inMemoryDB.products[idx]);
    res.json(inMemoryDB.products[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle product availability (Stock status)
// @route   PATCH /api/products/:id/toggle-stock
router.patch('/:id/toggle-stock', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      product.isAvailable = !product.isAvailable;
      await product.save();
      // 🔌 Real-time: Notify all clients of stock change
      getIO().emit('product-stock-updated', { _id: product._id, isAvailable: product.isAvailable, name: product.name });
      return res.json({ message: 'Stock status updated', isAvailable: product.isAvailable });
    }

    const product = inMemoryDB.products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isAvailable = !product.isAvailable;
    // 🔌 Real-time: Notify all clients of stock change (fallback mode)
    getIO().emit('product-stock-updated', { _id: product._id, isAvailable: product.isAvailable, name: product.name });
    res.json({ message: 'Stock status updated', isAvailable: product.isAvailable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      await Product.deleteOne({ _id: req.params.id });
      // 🔌 Real-time: Notify all clients of product removal
      getIO().emit('product-deleted', { _id: req.params.id });
      return res.json({ message: 'Product removed successfully' });
    }

    inMemoryDB.products = inMemoryDB.products.filter(p => p._id !== req.params.id);
    // 🔌 Real-time: Notify all clients of product removal (fallback mode)
    getIO().emit('product-deleted', { _id: req.params.id });
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
