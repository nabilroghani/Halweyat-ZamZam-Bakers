import express from 'express';
import mongoose from 'mongoose';
import Banner from '../models/Banner.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';

const router = express.Router();

// Sample initial banners for fallback mode
export const initialBanners = [
  {
    _id: 'b-1',
    badge: '🎉 10TH ANNIVERSARY GRAND CELEBRATION • AUG 10',
    title: 'Halwiyat Zamzam Anniversary Sale',
    subtitle: 'Celebrating 10 years of sweet traditions in Timergara with mega discounts & special family deals!',
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    displayOrder: 1
  },
  {
    _id: 'b-2',
    badge: '👑 100% PURE DESI GHEE HERITAGE',
    title: 'Shahi Sweets & Turkish Baklava',
    subtitle: 'Authentic Gulab Jamun, Rasmalai, and Turkish Baklava prepared fresh daily.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    displayOrder: 2
  },
  {
    _id: 'b-3',
    badge: '🎂 MASTER PASTRY CHEF STUDIO',
    title: 'Custom Birthday & Event Cakes',
    subtitle: 'Personalized multi-tier cakes with custom design photo upload & custom flavor options.',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    displayOrder: 3
  }
];

// @desc    Get all active banners (or all banners for admin)
// @route   GET /api/banners
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;

    if (mongoose.connection.readyState === 1) {
      const count = await Banner.countDocuments({});
      if (count === 0) {
        await Banner.insertMany(initialBanners.map(b => ({
          title: b.title,
          subtitle: b.subtitle,
          badge: b.badge,
          imageUrl: b.imageUrl,
          isActive: b.isActive,
          displayOrder: b.displayOrder
        })));
      }

      const filter = all === 'true' ? {} : { isActive: true };
      const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      return res.json(banners);
    }

    // In-memory fallback
    if (!inMemoryDB.banners) {
      inMemoryDB.banners = [...initialBanners];
    }

    let list = [...inMemoryDB.banners];
    if (all !== 'true') {
      list = list.filter(b => b.isActive);
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a banner (Admin only)
// @route   POST /api/banners
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, badge, imageUrl, displayOrder } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const banner = new Banner({
        title: title || '',
        subtitle: subtitle || '',
        badge: badge || '',
        imageUrl,
        displayOrder: Number(displayOrder) || 1,
        isActive: true
      });

      const created = await banner.save();
      return res.status(201).json(created);
    }

    // Fallback mode
    if (!inMemoryDB.banners) inMemoryDB.banners = [...initialBanners];
    const newBanner = {
      _id: `b-${Date.now()}`,
      title: title || '',
      subtitle: subtitle || '',
      badge: badge || '',
      imageUrl,
      displayOrder: Number(displayOrder) || 1,
      isActive: true
    };
    inMemoryDB.banners.unshift(newBanner);
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a banner (Admin only)
// @route   PUT /api/banners/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, badge, imageUrl, displayOrder, isActive } = req.body;

    if (mongoose.connection.readyState === 1) {
      const banner = await Banner.findById(req.params.id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });

      if (title !== undefined) banner.title = title;
      if (subtitle !== undefined) banner.subtitle = subtitle;
      if (badge !== undefined) banner.badge = badge;
      if (imageUrl) banner.imageUrl = imageUrl;
      if (displayOrder !== undefined) banner.displayOrder = Number(displayOrder);
      if (isActive !== undefined) banner.isActive = Boolean(isActive);

      const updated = await banner.save();
      return res.json(updated);
    }

    // Fallback mode
    if (!inMemoryDB.banners) inMemoryDB.banners = [...initialBanners];
    const idx = inMemoryDB.banners.findIndex(b => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Banner not found' });

    inMemoryDB.banners[idx] = {
      ...inMemoryDB.banners[idx],
      title: title !== undefined ? title : inMemoryDB.banners[idx].title,
      subtitle: subtitle !== undefined ? subtitle : inMemoryDB.banners[idx].subtitle,
      badge: badge !== undefined ? badge : inMemoryDB.banners[idx].badge,
      imageUrl: imageUrl || inMemoryDB.banners[idx].imageUrl,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : inMemoryDB.banners[idx].displayOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : inMemoryDB.banners[idx].isActive
    };

    res.json(inMemoryDB.banners[idx]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle banner active status (Admin only)
// @route   PATCH /api/banners/:id/toggle
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const banner = await Banner.findById(req.params.id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });

      banner.isActive = !banner.isActive;
      await banner.save();
      return res.json(banner);
    }

    if (!inMemoryDB.banners) inMemoryDB.banners = [...initialBanners];
    const banner = inMemoryDB.banners.find(b => b._id === req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    banner.isActive = !banner.isActive;
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete banner (Admin only)
// @route   DELETE /api/banners/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Banner.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Banner deleted successfully' });
    }

    if (!inMemoryDB.banners) inMemoryDB.banners = [...initialBanners];
    inMemoryDB.banners = inMemoryDB.banners.filter(b => b._id !== req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
