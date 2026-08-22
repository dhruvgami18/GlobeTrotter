const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { signToken } = require('../utils/jwt');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      city,
      country,
      bio,
      language = 'English',
    } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ success: false, message: 'First name is required' });
    }
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ success: false, message: 'Last name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? phone.trim() : null,
        city: city ? city.trim() : null,
        country: country ? country.trim() : null,
        bio: bio ? bio.trim() : null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName.trim())}`,
        language: language || 'English',
        role: 'USER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        bio: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(user);

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      country: user.country,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      language: user.language,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
