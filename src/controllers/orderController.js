import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';

const ORDER_OTP_PREFIX = 'ORDER_VERIFY';
const ORDER_OTP_STATUS = 'Pending OTP';
const PENDING_STATUS = 'Pending';
const ACTIVE_STATUS = 'Active';
const DONE_STATUS = 'Done';

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

function parseId(value) {
  const id = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return Number.isFinite(id) ? id : null;
}

function orderOtpPurpose(orderId) {
  return `${ORDER_OTP_PREFIX}:${orderId}`;
}

function formatOrder(order) {
  return {
    id: order.id,
    email: order.user?.email,
    customer_name: order.user?.name,
    service_id: order.serviceId,
    service_type: order.service?.title,
    service_description: order.serviceDescription,
    status: order.status,
    created_at: order.createdAt,
    createdAt: order.createdAt,
    expires_at: order.expiresAt,
    expiresAt: order.expiresAt,
  };
}

async function sendMail(mailOptions) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Order email] EMAIL_USER / EMAIL_PASS not set. Email skipped:', mailOptions.subject);
    return { sent: false, skipped: true };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    ...mailOptions,
  });

  return { sent: true, skipped: false };
}

async function findServiceByType(serviceType) {
  const trimmed = serviceType?.toString().trim();
  if (!trimmed) return null;

  const byTitle = await prisma.service.findFirst({
    where: { title: { equals: trimmed, mode: 'insensitive' } },
  });
  if (byTitle) return byTitle;

  const maybeId = parseId(trimmed);
  if (maybeId != null) {
    return prisma.service.findUnique({ where: { id: maybeId } });
  }

  return null;
}

export const requestService = async (req, res) => {
  let createdOrderId = null;
  let createdOtpId = null;

  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { service_type: serviceType } = req.body;
    const serviceDescription = req.body.service_description?.toString().trim();

    if (!serviceType || !serviceDescription) {
      return res.status(400).json({ message: 'service_type and service_description are required' });
    }

    const [user, service] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      findServiceByType(serviceType),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        status: ORDER_OTP_STATUS,
        expiresAt: otpExpiresAt,
        serviceDescription,
        serviceId: service.id,
        userId,
      },
      include: { service: true, user: true },
    });
    createdOrderId = order.id;

    const otp = await prisma.otp.create({
      data: {
        otp: otpCode,
        purpose: orderOtpPurpose(order.id),
        expiresAt: otpExpiresAt,
        userId,
      },
    });
    createdOtpId = otp.id;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[Order OTP] Email not configured. OTP for order', order.id, ':', otpCode);

      if (process.env.OTP_DEV_RETURN_CODE !== 'true') {
        await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
        await prisma.order.delete({ where: { id: createdOrderId } }).catch(() => {});
        return res.status(503).json({
          message:
            'Email is not configured on the server. Set EMAIL_USER and EMAIL_PASS, or for local testing set OTP_DEV_RETURN_CODE=true.',
        });
      }
    } else {
      try {
        await sendMail({
          to: user.email,
          subject: 'Confirm your service request',
          text: `Your OTP for the "${service.title}" service request is: ${otpCode}. It expires in 10 minutes.`,
        });
      } catch (mailErr) {
        console.error('Order OTP email failed:', mailErr);
        await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
        await prisma.order.delete({ where: { id: createdOrderId } }).catch(() => {});
        return res.status(503).json({ message: 'Could not send OTP email. Please try again later.' });
      }
    }

    return res.status(201).json({
      status: 'otp_sent',
      request_id: order.id,
      order_id: order.id,
      message: 'Order placed, OTP sent.',
      ...(process.env.OTP_DEV_RETURN_CODE === 'true' && process.env.NODE_ENV !== 'production'
        ? { devOnlyOtp: otpCode }
        : {}),
    });
  } catch (error) {
    console.error('requestService error:', error);
    if (createdOtpId) await prisma.otp.delete({ where: { id: createdOtpId } }).catch(() => {});
    if (createdOrderId) await prisma.order.delete({ where: { id: createdOrderId } }).catch(() => {});
    return res.status(500).json({ message: 'Error requesting service', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { service: true, user: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders.map(formatOrder));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseId(req.body.id);
    const status = req.body.status?.toString().trim();

    if (orderId == null || !status) {
      return res.status(400).json({ message: 'id and status are required' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { service: true, user: true },
    });

    if (status.toLowerCase() === DONE_STATUS.toLowerCase()) {
      await sendMail({
        to: order.user.email,
        subject: 'Your order is complete',
        text: `Your "${order.service.title}" order has been marked as done. Thank you for choosing Strategy Solutions.`,
      }).catch((mailErr) => {
        console.error('Completion email failed:', mailErr);
      });
    }

    res.json({
      status: 'success',
      message:
        order.status.toLowerCase() === DONE_STATUS.toLowerCase()
          ? 'Status updated and completion email sent.'
          : 'Status updated successfully.',
      order: formatOrder(order),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

export const confirmOrderActivation = async (req, res) => {
  try {
    const orderId = parseId(req.body.order_id ?? req.body.id);
    if (orderId == null) {
      return res.status(400).json({ message: 'order_id is required' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: ACTIVE_STATUS },
      include: { service: true, user: true },
    });

    await sendMail({
      to: order.user.email,
      subject: 'Your order is now active',
      text: `Your "${order.service.title}" order has been confirmed and is now active.`,
    }).catch((mailErr) => {
      console.error('Activation email failed:', mailErr);
    });

    return res.status(200).json({
      status: 'success',
      message: 'Order confirmed and email sent',
      order: formatOrder(order),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(500).json({ message: 'Error confirming order', error: error.message });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const orderId = parseId(req.body.order_id ?? req.body.id);
    if (orderId == null) {
      return res.status(400).json({ message: 'order_id is required' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: DONE_STATUS },
      include: { service: true, user: true },
    });

    await sendMail({
      to: order.user.email,
      subject: 'Your order is complete',
      text: `Your "${order.service.title}" order has been marked as done. Thank you for choosing Strategy Solutions.`,
    }).catch((mailErr) => {
      console.error('Completion email failed:', mailErr);
    });

    return res.status(200).json({
      status: 'success',
      message: 'Order marked as done and email sent',
      order: formatOrder(order),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(500).json({ message: 'Error completing order', error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id, isAdmin } = req.body;
  try {
    const orderId = parseId(id);
    if (orderId == null) {
      return res.status(400).json({ message: 'id is required' });
    }

    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const adminDelete = isAdmin === true && req.user?.role === 'ADMIN';
    if (!adminDelete) {
      if (order.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
      if (![PENDING_STATUS, ORDER_OTP_STATUS].includes(order.status)) {
        return res.status(400).json({ message: 'Can only delete pending orders' });
      }
    }

    await prisma.otp.deleteMany({ where: { userId: order.userId, purpose: orderOtpPurpose(order.id) } });
    await prisma.order.delete({ where: { id: orderId } });

    res.json({ status: 'success', message: 'order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
