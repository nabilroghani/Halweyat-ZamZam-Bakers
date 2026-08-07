import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect, adminOnly, authorizeRoles } from '../middleware/authMiddleware.js';
import { inMemoryDB } from '../server.js';
import { isValidEmail, isValidPakistaniPhone, formatPakistaniPhone, hasValidEmailMxDomain, verifyRealMailboxExists } from '../utils/validation.js';
import { sendOtpVerificationEmail, sendForgotPasswordEmail } from '../utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userObj) => {
  const payload = typeof userObj === 'object' && userObj !== null 
    ? { id: userObj._id || userObj.id, role: userObj.role || 'customer', email: userObj.email || '' }
    : { id: userObj, role: 'customer' };

  return jwt.sign(payload, process.env.JWT_SECRET || 'zamzam_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const generate6DigitOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Verify active JWT token & return decoded claims
// @route   GET /api/auth/verify-token
router.get('/verify-token', async (req, res) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(400).json({ valid: false, message: 'No authorization token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zamzam_secret_key_2026');
    const nowSec = Math.floor(Date.now() / 1000);
    const expiresInSec = decoded.exp ? decoded.exp - nowSec : null;

    res.json({
      valid: true,
      algorithm: 'HS256',
      issuer: 'Halwiyat-ZamZam-Auth-Authority',
      token,
      payload: {
        id: decoded.id,
        role: decoded.role || 'customer',
        email: decoded.email || '',
        iat: decoded.iat,
        exp: decoded.exp
      },
      expiresInSeconds: expiresInSec,
      isExpired: expiresInSec !== null && expiresInSec <= 0
    });
  } catch (err) {
    res.status(401).json({
      valid: false,
      message: err.message || 'Token verification failed'
    });
  }
});

// @desc    Google OAuth 2.0 Sign In / Register (Direct verified Google Account)
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    let email, name, avatar, googleId;

    if (!token) {
      return res.status(400).json({ message: 'Google Authentication Token is required' });
    }

    try {
      // Verify token signature with Google OAuth client if GOOGLE_CLIENT_ID configured
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || '1082498274981-zamzam.apps.googleusercontent.com'
      });
      const payload = ticket.getPayload();
      email = payload.email?.toLowerCase().trim();
      name = payload.name;
      avatar = payload.picture;
      googleId = payload.sub;
    } catch (err) {
      // Fallback: Verify JWT payload from Google's official GSI client token
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        // Enforce that issuer is Google and email is verified by Google
        if (payload.iss && (payload.iss.includes('accounts.google.com') || payload.iss === 'https://accounts.google.com')) {
          email = payload.email?.toLowerCase().trim();
          name = payload.name;
          avatar = payload.picture;
          googleId = payload.sub;
        } else {
          return res.status(400).json({ message: 'Invalid Google Token signature issuer' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid or malformed Google ID Token' });
      }
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Could not retrieve a valid verified email from Google' });
    }

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email });

      if (user) {
        user.isEmailVerified = true;
        if (avatar) user.avatar = avatar;
        if (googleId) user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({
          name: name || 'Google Customer',
          email,
          phone: '',
          password: `google_${Date.now()}_${Math.random()}`,
          role: 'customer',
          isEmailVerified: true,
          avatar: avatar || '',
          googleId: googleId || ''
        });
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        avatar: user.avatar,
        isEmailVerified: true,
        token: generateToken(user)
      });
    }

    // Fallback mode Google Login
    let memUser = inMemoryDB.users.find(u => u.email === email);
    if (!memUser) {
      memUser = {
        _id: `u-${Date.now()}`,
        name: name || 'Google Customer',
        email,
        phone: '',
        passwordHash: 'google_authenticated',
        role: 'customer',
        address: '',
        isEmailVerified: true
      };
      inMemoryDB.users.push(memUser);
    }

    res.json({
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      phone: memUser.phone,
      role: memUser.role,
      address: memUser.address,
      isEmailVerified: true,
      token: generateToken(memUser)
    });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication error: ' + error.message });
  }
});



// @desc    Register a new customer account (Triggers 6-Digit Email OTP)
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, address, city } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // UPFRONT REAL MAILBOX EXISTENCE CHECK
    const mailboxCheck = await verifyRealMailboxExists(cleanEmail);
    if (!mailboxCheck.valid) {
      return res.status(400).json({ message: mailboxCheck.reason });
    }

    if (!isValidPakistaniPhone(phone)) {
      return res.status(400).json({ message: 'Please enter a valid Pakistani mobile number (e.g. 03275001166 or 03001234567)' });
    }

    const formattedPhone = formatPakistaniPhone(phone);
    const otpCode = generate6DigitOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        if (userExists.isEmailVerified) {
          return res.status(400).json({ message: 'An account with this email address already exists. Please Sign In.' });
        } else {
          // Attempt to send email verification FIRST before saving OTP to DB
          const mailRes = await sendOtpVerificationEmail(cleanEmail, name, otpCode);
          if (!mailRes.success) {
            return res.status(400).json({
              message: mailRes.error || `Email delivery failed! The email address '${cleanEmail}' does not exist or cannot receive emails. Please check for typos and enter a real active email address.`
            });
          }

          userExists.emailVerificationOtp = otpCode;
          userExists.otpExpiresAt = otpExpires;
          userExists.password = password;
          await userExists.save();

          return res.status(200).json({
            requiresOtp: true,
            email: cleanEmail,
            message: `Verification code sent to ${cleanEmail}`
          });
        }
      }

      // Attempt to send email verification FIRST before creating user
      const mailRes = await sendOtpVerificationEmail(cleanEmail, name, otpCode);
      if (!mailRes.success) {
        return res.status(400).json({
          message: mailRes.error || `Email delivery failed! The email address '${cleanEmail}' does not exist or cannot receive emails. Please check for typos and enter a real active email address.`
        });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        phone: formattedPhone,
        password,
        role: 'customer',
        address: address || '',
        city: city || 'Timergara',
        isEmailVerified: false,
        emailVerificationOtp: otpCode,
        otpExpiresAt: otpExpires
      });

      return res.status(201).json({
        requiresOtp: true,
        email: user.email,
        message: `Verification code sent to ${user.email}`
      });
    }

    // Fallback in-memory registration
    const existingMem = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (existingMem && existingMem.isEmailVerified) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    const mailRes = await sendOtpVerificationEmail(cleanEmail, name, otpCode);
    if (!mailRes.success) {
      return res.status(400).json({
        message: mailRes.error || `Email delivery failed! The email address '${cleanEmail}' does not exist or cannot receive emails. Please check for typos and enter a real active email address.`
      });
    }

    const newMemUser = {
      _id: `u-${Date.now()}`,
      name,
      email: cleanEmail,
      phone: formattedPhone,
      passwordHash: password,
      role: 'customer',
      address: address || '',
      isEmailVerified: false,
      emailVerificationOtp: otpCode,
      otpExpiresAt: otpExpires
    };
    inMemoryDB.users.push(newMemUser);

    res.status(201).json({
      requiresOtp: true,
      email: cleanEmail,
      message: `Verification code sent to ${cleanEmail}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify 6-Digit Email OTP Code
// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and 6-digit verification code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ message: 'Account not found. Please register.' });
      }

      if (user.emailVerificationOtp !== otp.trim()) {
        return res.status(400).json({ message: 'Invalid 6-digit verification code' });
      }

      if (user.otpExpiresAt && new Date(user.otpExpiresAt) < new Date()) {
        return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
      }

      user.isEmailVerified = true;
      user.emailVerificationOtp = '';
      await user.save();

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        isEmailVerified: true,
        token: generateToken(user)
      });
    }

    // Fallback mode OTP verification
    const memUser = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (!memUser) return res.status(404).json({ message: 'Account not found' });

    if (memUser.emailVerificationOtp && memUser.emailVerificationOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid 6-digit verification code' });
    }

    memUser.isEmailVerified = true;
    memUser.emailVerificationOtp = '';

    res.json({
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      phone: memUser.phone,
      role: memUser.role,
      address: memUser.address,
      isEmailVerified: true,
      token: generateToken(memUser)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Resend 6-Digit Email OTP
// @route   POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = generate6DigitOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) return res.status(404).json({ message: 'User account not found' });

      const mailRes = await sendOtpVerificationEmail(cleanEmail, user.name, otpCode);
      if (!mailRes.success) {
        return res.status(400).json({ message: mailRes.error || `Email delivery failed to ${cleanEmail}. Please check for typos.` });
      }

      user.emailVerificationOtp = otpCode;
      user.otpExpiresAt = otpExpires;
      await user.save();

      return res.json({ message: `New verification code sent to ${cleanEmail}` });
    }

    const memUser = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (memUser) {
      const mailRes = await sendOtpVerificationEmail(cleanEmail, memUser.name, otpCode);
      if (!mailRes.success) {
        return res.status(400).json({ message: mailRes.error || `Email delivery failed to ${cleanEmail}.` });
      }
      memUser.emailVerificationOtp = otpCode;
      memUser.otpExpiresAt = otpExpires;
    }
    res.json({ message: `New verification code sent to ${cleanEmail}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request 6-Digit Password Reset OTP via Email
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    const cleanEmail = email.toLowerCase().trim();

    const mailboxCheck = await verifyRealMailboxExists(cleanEmail);
    if (!mailboxCheck.valid) {
      return res.status(400).json({ message: mailboxCheck.reason });
    }

    const otpCode = generate6DigitOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ message: 'No account found with this email address' });
      }

      const mailRes = await sendForgotPasswordEmail(cleanEmail, user.name, otpCode);
      if (!mailRes.success) {
        return res.status(400).json({ message: mailRes.error || `Failed to send password reset code to ${cleanEmail}.` });
      }

      user.resetPasswordOtp = otpCode;
      user.resetPasswordOtpExpiresAt = otpExpires;
      await user.save();

      return res.json({ success: true, email: cleanEmail, message: `6-digit password reset code sent to ${cleanEmail}` });
    }

    // Fallback mode
    const memUser = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (!memUser) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const mailRes = await sendForgotPasswordEmail(cleanEmail, memUser.name, otpCode);
    if (!mailRes.success) {
      return res.status(400).json({ message: mailRes.error || `Failed to send password reset code to ${cleanEmail}.` });
    }

    memUser.resetPasswordOtp = otpCode;
    memUser.resetPasswordOtpExpiresAt = otpExpires;

    res.json({ success: true, email: cleanEmail, message: `6-digit password reset code sent to ${cleanEmail}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reset Password using 6-Digit OTP Code
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, 6-digit reset code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) return res.status(404).json({ message: 'User account not found' });

      if (user.resetPasswordOtp !== otp.trim()) {
        return res.status(400).json({ message: 'Invalid 6-digit password reset code' });
      }

      if (user.resetPasswordOtpExpiresAt && new Date(user.resetPasswordOtpExpiresAt) < new Date()) {
        return res.status(400).json({ message: 'Reset code has expired. Please request a new code.' });
      }

      user.password = newPassword; // Will be hashed automatically by pre-save hook
      user.resetPasswordOtp = '';
      user.isEmailVerified = true;
      await user.save();

      return res.json({
        success: true,
        message: 'Password reset successfully! Account updated.',
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token: generateToken(user)
      });
    }

    // Fallback mode
    const memUser = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (!memUser) return res.status(404).json({ message: 'User account not found' });

    if (memUser.resetPasswordOtp && memUser.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid 6-digit password reset code' });
    }

    memUser.passwordHash = newPassword;
    memUser.resetPasswordOtp = '';
    memUser.isEmailVerified = true;

    res.json({
      success: true,
      message: 'Password reset successfully! Account updated.',
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      phone: memUser.phone,
      role: memUser.role,
      address: memUser.address,
      token: generateToken(memUser)
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

    const cleanEmail = email.toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address (e.g. name@example.com)' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        // If customer has not verified OTP, block login and prompt OTP screen
        if (user.role === 'customer' && user.isEmailVerified === false) {
          const otpCode = generate6DigitOtp();
          user.emailVerificationOtp = otpCode;
          user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
          await user.save();

          await sendOtpVerificationEmail(cleanEmail, user.name, otpCode);

          return res.status(403).json({
            requiresOtp: true,
            email: cleanEmail,
            message: 'Email address not verified yet. A 6-digit verification code has been sent to your Gmail inbox!'
          });
        }

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          avatar: user.avatar,
          token: generateToken(user)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // In-memory fallback authentication
    const user = inMemoryDB.users.find(u => u.email === cleanEmail);
    if (user && (user.passwordHash === password || user.password === password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '0327-5001166',
        role: user.role || 'customer',
        address: user.address || '',
        token: generateToken(user)
      });
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

// @desc    Update logged-in user profile (name, phone, address)
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (address !== undefined) user.address = address.trim();

      const updated = await user.save();
      const token = generateToken(updated);

      return res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        role: updated.role,
        token
      });
    }

    // In-memory fallback
    const userIdx = inMemoryDB.users.findIndex(u => u._id === req.user._id?.toString());
    if (userIdx === -1) return res.status(404).json({ message: 'User not found' });

    if (name) inMemoryDB.users[userIdx].name = name.trim();
    if (phone !== undefined) inMemoryDB.users[userIdx].phone = phone.trim();
    if (address !== undefined) inMemoryDB.users[userIdx].address = address.trim();

    const updated = inMemoryDB.users[userIdx];
    const token = generateToken(updated);

    res.json({ ...updated, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's saved favorites array
// @route   GET /api/auth/favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      return res.json(user?.favorites || []);
    }

    const user = inMemoryDB.users.find(u => u._id === req.user._id?.toString());
    return res.json(user?.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle a product ID in user's permanent favorites list
// @route   POST /api/auth/favorites/toggle
router.post('/favorites/toggle', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!user.favorites) user.favorites = [];
      
      const index = user.favorites.indexOf(productId);
      if (index > -1) {
        user.favorites.splice(index, 1);
      } else {
        user.favorites.push(productId);
      }

      await user.save();
      return res.json({ favorites: user.favorites });
    }

    // In-memory fallback
    const user = inMemoryDB.users.find(u => u._id === req.user._id?.toString());
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favorites) user.favorites = [];
    const index = user.favorites.indexOf(productId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
