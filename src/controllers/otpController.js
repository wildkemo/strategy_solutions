import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
import { OtpResponseDto, ValidateOtpRequestDto } from '../dtos/OtpDto.js';

/**
 * OTP Controller
 * createOtp / validateOtp run behind checkAuth — use req.user.userId (no second JWT verify).
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function resolveUserId(req) {
  const raw = req.user?.userId ?? req.user?.id ?? req.user?.sub;
  const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
  return Number.isFinite(id) ? id : null;
}

export const createOtp = async (req, res) => {
  let createdOtpId = null;
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rawPurpose = (req.body?.purpose || 'ACTIVATION').toString().trim().toUpperCase();
    const purpose = rawPurpose === 'DELETE_ACCOUNT' ? 'DELETE_ACCOUNT' : 'ACTIVATION';

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const row = await prisma.otp.create({
      data: {
        otp: otpCode,
        userId: userId,
        expiresAt: expiresAt,
        purpose,
      },
    });
    createdOtpId = row.id;

    const isDelete = purpose === 'DELETE_ACCOUNT';
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: isDelete ? 'Confirm account deletion' : 'Your Verification Code',
      text: isDelete
        ? `You requested to permanently delete your Strategy Solutions account. Your 6-digit code is: ${otpCode}. It expires in 10 minutes. If you did not request this, ignore this email and secure your account.`
        : `Your 6-digit verification code is: ${otpCode}. It expires in 10 minutes.`,
    };

    const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    if (emailConfigured) {
      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('sendMail failed:', mailErr);
        await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
        return res.status(503).json({
          error:
            'Could not send verification email. Check EMAIL_USER / EMAIL_PASS, or try again later.',
        });
      }
    } else {
      console.warn(
        '[OTP] EMAIL_USER / EMAIL_PASS not set — email not sent. OTP (dev only) for',
        user.email,
        ':',
        otpCode,
      );
      if (process.env.OTP_DEV_RETURN_CODE === 'true') {
        return res.status(200).json({
          message: 'OTP generated (email disabled). Use code from server logs or response.',
          ...(process.env.NODE_ENV !== 'production' ? { devOnlyOtp: otpCode } : {}),
        });
      }
      await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
      return res.status(503).json({
        error:
          'Email is not configured on the server. Set EMAIL_USER and EMAIL_PASS, or for local testing set OTP_DEV_RETURN_CODE=true (never in production).',
      });
    }

    res.status(200).json(new OtpResponseDto('OTP sent to your email'));
  } catch (error) {
    console.error('Create OTP error:', error);
    if (createdOtpId) {
      await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
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

    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: userId,
        otp: otp,
        expiresAt: { gt: new Date() },
        NOT: { purpose: 'DELETE_ACCOUNT' },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActivated: true },
    });

    await prisma.otp.delete({
      where: { id: otpRecord.id },
    });

    res.status(200).json(new OtpResponseDto('Account activated successfully'));
  } catch (error) {
    console.error('Validate OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
