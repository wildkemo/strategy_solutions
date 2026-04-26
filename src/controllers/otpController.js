import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { OtpResponseDto, ValidateOtpRequestDto } from '../dtos/OtpDto.js';

/**
 * OTP Controller
 */

// Configure Nodemailer transporter
// Note: In production, these should be environment variables.
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createOtp = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access_secret_fallback');
    const userId = payload.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    await prisma.otp.create({
      data: {
        otp: otpCode,
        userId: userId,
        expiresAt: expiresAt,
      },
    });

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Verification Code',
      text: `Your 6-digit verification code is: ${otpCode}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json(new OtpResponseDto('OTP sent to your email'));
  } catch (error) {
    console.error('Create OTP error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateOtp = async (req, res) => {
  try {
    const validateData = new ValidateOtpRequestDto(req.body);
    const { isValid, errors } = validateData.validate();

    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { otp } = validateData;

    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access_secret_fallback');
    const userId = payload.userId;

    // Find the latest OTP for this user
    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: userId,
        otp: otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user to activated
    await prisma.user.update({
      where: { id: userId },
      data: { isActivated: true },
    });

    // Delete the used OTP record
    await prisma.otp.delete({
      where: { id: otpRecord.id },
    });

    res.status(200).json(new OtpResponseDto('Account activated successfully'));
  } catch (error) {
    console.error('Validate OTP error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
