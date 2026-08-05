import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { inMemoryDB } from '../server.js';

// Verify JWT Token Middleware
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zamzam_secret_key_2026');
      
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const memUser = inMemoryDB.users.find(u => u._id === decoded.id);
        if (memUser) {
          req.user = { 
            _id: memUser._id, 
            name: memUser.name, 
            email: memUser.email, 
            role: memUser.role,
            phone: memUser.phone || '',
            address: memUser.address || ''
          };
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Authentication failed: User account not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized: Invalid or expired JWT token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: No token provided in headers' });
  }
};

// Strict RBAC Role Authorization Middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden Access: Role '${req.user.role}' is not authorized to access this resource. Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

export const adminOnly = authorizeRoles('admin');
export const staffOnly = authorizeRoles('admin', 'receptionist');
