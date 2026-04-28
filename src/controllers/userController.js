import bcrypt from 'bcrypt';
import prisma from '../utils/prisma.js';

const clearAuthCookies = (res) => {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.clearCookie('access_token', opts);
  res.clearCookie('refresh_token', opts);
};

function resolveUserId(req) {
  const raw = req.user?.userId ?? req.user?.id ?? req.user?.sub;
  const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
  return Number.isFinite(id) ? id : null;
}

/**
 * PATCH /api/update_user_info
 * Body: { name?, phone?, password?, company_name?, currentPassword } (currentPassword required)
 */
export const updateUserInfo = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, phone, password, company_name: companyName, currentPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return res.status(400).json({ error: 'currentPassword is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordOk = await bcrypt.compare(currentPassword, user.password);
    if (!passwordOk) {
      return res.status(403).json({ error: 'Wrong current password' });
    }

    if (user.role === 'ADMIN') {
      const data = {};
      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
          return res.status(400).json({ error: 'Invalid name' });
        }
        data.name = name.trim();
      }
      if (password !== undefined && password !== '') {
        if (typeof password !== 'string' || password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        data.password = await bcrypt.hash(password, 10);
      }
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      await prisma.user.update({
        where: { id: userId },
        data,
      });
      return res.status(200).json({ status: 'success' });
    }

    const data = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Invalid name' });
      }
      data.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string' || !phone.trim()) {
        return res.status(400).json({ error: 'Invalid phone' });
      }
      const nextPhone = phone.trim();
      const phoneTaken = await prisma.user.findFirst({
        where: {
          phone: nextPhone,
          NOT: { id: userId },
        },
      });
      if (phoneTaken) {
        return res.status(409).json({ error: 'Phone number already in use' });
      }
      data.phone = nextPhone;
    }

    if (companyName !== undefined) {
      if (typeof companyName !== 'string' || !companyName.trim()) {
        return res.status(400).json({ error: 'Invalid company_name' });
      }
      data.companyName = companyName.trim();
    }

    if (password !== undefined && password !== '') {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('updateUserInfo error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/delete_account
 * Body: { otp, purpose } — purpose must match OTP (e.g. DELETE_ACCOUNT)
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { otp } = req.body;

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ error: 'Invalid or incorrect OTP or OTP expired' });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId,
        otp: otp.trim(),
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or incorrect OTP or OTP expired' });
    }

    await prisma.otp.delete({ where: { id: otpRecord.id } }).catch(() => {});

    await prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => {});

    await prisma.user.delete({ where: { id: userId } });

    clearAuthCookies(res);
    return res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully.',
    });
  } catch (error) {
    console.error('deleteAccount error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
