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

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const row = await prisma.otp.create({
      data: {
        otp: otpCode,
        userId: userId,
        expiresAt: expiresAt,
      },
    });
    createdOtpId = row.id;

    const mailOptions = {
      from: `"Strategy Solution" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Verification Code – Strategy Solution",
    
      // Fallback (plain text)
      text: `Your verification code is ${otpCode}. It expires in 10 minutes. If you didn’t request this, ignore this email.`,
    
      // Main email (HTML)
      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
          <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center;">
            
            <h2 style="margin-bottom:10px;">🔐 Verification Code</h2>
            <p style="color:#555;">Use the code below to continue with <strong>Strategy Solution</strong></p>
            
            <div style="font-size:32px; font-weight:bold; letter-spacing:6px; margin:20px 0; color:#2d89ef;">
              ${otpCode}
            </div>
    
            <p style="color:#777; font-size:14px;">This code expires in <strong>10 minutes</strong>.</p>
    
            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
    
            <p style="font-size:12px; color:#999;">
              If you didn’t request this code, you can safely ignore this email.
            </p>
    
            <p style="font-size:12px; color:#999; margin-top:20px;">
              Built by <strong>Vortex</strong>
            </p>
    
          </div>
        </div>
      `,
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
