import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../utils/prisma.js';
import { 
  SignupRequestDto, 
  SignupResponseDto, 
  LoginRequestDto, 
  LoginResponseDto, 
  SessionResponseDto 
} from '../dtos/AuthDto.js';
import { MessageDto } from '../dtos/CommonDto.js';

// --- Helpers ---

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET || 'access_secret_fallback',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};

// --- Handlers ---

export const signup = async (req, res) => {
  try {
    const signupData = new SignupRequestDto(req.body);
    const { isValid, errors } = signupData.validate();

    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { name, email, password, phone, companyName } = signupData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        companyName: companyName || (undefined),
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshTokenStr = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenStr,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    setAuthCookies(res, accessToken, refreshTokenStr);

    res.status(201).json(new SignupResponseDto(user));
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const loginData = new LoginRequestDto(req.body);
    const { isValid, errors } = loginData.validate();

    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { email, password } = loginData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshTokenStr = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenStr,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshTokenStr);

    res.json(new LoginResponseDto(user, user.role === 'ADMIN'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => {});
    }

    clearAuthCookies(res);
    res.json(new MessageDto('Logged out'));
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const dbToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Rotate tokens
    await prisma.refreshToken.delete({ where: { id: dbToken.id } });

    const newAccessToken = generateAccessToken(dbToken.user);
    const newRefreshTokenStr = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: newRefreshTokenStr,
        userId: dbToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, newAccessToken, newRefreshTokenStr);
    res.json(new MessageDto('Token refreshed'));
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const session = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      // If access token is missing, client might need to refresh
      return res.status(401).json({ error: 'No access token' });
    }

    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access_secret_fallback');
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    res.json(new SessionResponseDto(user, user.role === 'ADMIN'));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Client should hit /refresh_token
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ error: 'Invalid access token' });
  }
};

export const getCurrentUser = async (req, res) => {
  // Same logic as session check but often used to just get profile
  return session(req, res);
};
