import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect, adminOnly, authorizeRoles } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'zamzam_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new customer account
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, address, city } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email address already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
        role: 'customer',
        address: address || '',
        city: city || 'Timergara'
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token: generateToken(user._id)
      });
    }

    // Fallback in-memory registration
    const existingMem = inMemoryDB.users.find(u => u.email === email.toLowerCase());
    if (existingMem) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    const newMemUser = {
      _id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: password,
      role: 'customer',
      address: address || '',
      city: city || 'Timergara',
      createdAt: new Date().toISOString()
    };
    inMemoryDB.users.push(newMemUser);

    res.status(201).json({
      _id: newMemUser._id,
      name: newMemUser.name,
      email: newMemUser.email,
      phone: newMemUser.phone,
      role: newMemUser.role,
      address: newMemUser.address,
      token: generateToken(newMemUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user (Customer / Receptionist / Admin) & get JWT token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      }
    } else {
      const memUser = inMemoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
      if (memUser) {
        return res.json({
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone || '',
          role: memUser.role,
          address: memUser.address || '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          token: generateToken(memUser._id)
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @desc    Admin only: Get all users list
// @route   GET /api/auth/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }
    res.json(inMemoryDB.users.map(({ passwordHash, ...u }) => u));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin only: Create Receptionist or Admin staff account
// @route   POST /api/auth/create-staff
router.post('/create-staff', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    if (!['admin', 'receptionist'].includes(role)) {
      return res.status(400).json({ message: 'Staff role must be admin or receptionist' });
    }

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const staffUser = await User.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
        role
      });

      return res.status(201).json({ message: 'Staff account created successfully', user: staffUser });
    }

    const newStaff = {
      _id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash: password,
      role
    };
    inMemoryDB.users.push(newStaff);
    res.status(201).json({ message: 'Staff account created successfully', user: newStaff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
