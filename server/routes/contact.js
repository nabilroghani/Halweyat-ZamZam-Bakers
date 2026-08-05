import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit customer inquiry message
// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone and message are required' });
    }

    const contact = new Contact({
      name,
      email: email || 'not-provided@customer.com',
      phone,
      subject: subject || 'General Inquiry',
      message
    });

    const savedContact = await contact.save();
    res.status(201).json({ message: 'Message sent successfully!', contact: savedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all inquiries (Admin / Receptionist)
// @route   GET /api/contact
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
