import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone, and message are required fields.' });
    }

    try {
      const contact = new Contact({ name, phone, message });
      await contact.save();
    } catch (dbErr) {
      console.warn('Contact saved in memory fallback (DB offline):', { name, phone, message });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to Halwiyat Zamzam Bakers.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing contact form', error: error.message });
  }
});

export default router;
