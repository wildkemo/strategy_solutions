import prisma from '../utils/prisma.js';
import { sendUserEmail } from '../utils/mail.js';

const PURPOSE_ORDER = 'ORDER_VERIFY';

function resolveUserId(req) {
  const raw = req.user?.userId ?? req.user?.id ?? req.user?.sub;
  const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
  return Number.isFinite(id) ? id : null;
}

function isAdminReq(req) {
  return req.user?.role === 'ADMIN';
}

async function resolveServiceByType(service_type) {
  const raw = (service_type ?? '').toString().trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    return prisma.service.findUnique({ where: { id: parseInt(raw, 10) } });
  }
  return prisma.service.findFirst({
    where: { title: { equals: raw, mode: 'insensitive' } },
  });
}

function formatUserOrder(o) {
  return {
    id: o.id,
    service_type: o.service?.title ?? '',
    status: o.status,
    otp: o.status === 'Pending',
    created_at: o.createdAt,
    service_description: o.serviceDescription,
  };
}

function formatAdminOrder(o) {
  return {
    id: o.id,
    email: o.user?.email ?? '',
    service_type: o.service?.title ?? '',
    status: o.status,
    created_at: o.createdAt,
    service_description: o.serviceDescription,
    userId: o.userId,
  };
}

/** POST /api/request_service */
export const requestService = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Not logged in' });
    }

    const { service_type, service_description } = req.body;
    const desc = (service_description ?? '').toString().trim();
    if (!desc) {
      return res.status(400).json({ error: 'service_description is required', message: 'Description required' });
    }

    const service = await resolveServiceByType(service_type);
    if (!service) {
      return res.status(400).json({ error: 'Unknown service_type', message: 'Service not found' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const orderExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId,
          serviceId: service.id,
          serviceDescription: desc,
          status: 'Pending',
          expiresAt: orderExpires,
        },
      });
      await tx.otp.create({
        data: {
          otp: otpCode,
          userId,
          orderId: o.id,
          purpose: PURPOSE_ORDER,
          expiresAt: otpExpires,
        },
      });
      return o;
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    let mail;
    try {
      mail = await sendUserEmail({
        to: user.email,
        subject: 'Confirm your service request',
        text: `Thank you for your request (${service.title}). Your 6-digit confirmation code is: ${otpCode}. It expires in 10 minutes.\n\nDescription you provided:\n${desc}`,
      });
    } catch (e) {
      console.error('request_service sendMail:', e);
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
      return res.status(503).json({
        error: 'Could not send email',
        message: 'Could not send verification email. Try again later.',
      });
    }

    if (mail.skipped && process.env.OTP_DEV_RETURN_CODE !== 'true') {
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
      return res.status(503).json({
        error: 'Could not send email',
        message: 'Email is not configured. Set EMAIL_USER / EMAIL_PASS or OTP_DEV_RETURN_CODE=true for local dev.',
      });
    }

    if (mail.skipped && process.env.OTP_DEV_RETURN_CODE === 'true') {
      console.warn('[request_service] dev OTP for', user.email, ':', otpCode);
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
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** POST /api/verify_otp */
export const verifyOtp = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Not logged in' });
    }

    const orderIdRaw = req.body.order_id ?? req.body.orderId;
    const orderId = parseInt(orderIdRaw, 10);
    const otp = (req.body.otp ?? '').toString().trim();

    if (!Number.isFinite(orderId) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid order_id or otp', message: 'Invalid request' });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { service: true, user: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found', message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Order not awaiting OTP', message: 'Order is not pending verification' });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId,
        orderId,
        otp,
        purpose: PURPOSE_ORDER,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      const expired = await prisma.otp.findFirst({
        where: { userId, orderId, purpose: PURPOSE_ORDER, otp },
        orderBy: { createdAt: 'desc' },
      });
      if (expired && expired.expiresAt <= new Date()) {
        return res.status(410).json({ error: 'OTP expired', message: 'OTP expired' });
      }
      return res.status(400).json({ error: 'Incorrect OTP', message: 'Incorrect OTP' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.otp.delete({ where: { id: otpRecord.id } });
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'Verified' },
      });
    });

    await sendUserEmail({
      to: order.user.email,
      subject: 'Thank you — request verified',
      text: `Hello ${order.user.name},\n\nYour service request #${orderId} (${order.service.title}) has been verified. Our team will review it shortly.\n\nThank you,\nStrategy Solutions`,
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('verifyOtp error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** GET /api/get_user_orders | /api/get_orders */
export const getUserOrders = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rows = await prisma.order.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ orders: rows.map(formatUserOrder) });
  } catch (error) {
    console.error('getUserOrders error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** GET /api/get_pending_otp_orders */
export const getPendingOtpOrders = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rows = await prisma.order.findMany({
      where: { userId, status: 'Pending' },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      status: 'success',
      pendingOrders: rows.map(formatUserOrder),
    });
  } catch (error) {
    console.error('getPendingOtpOrders error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** GET /api/get_all_orders (admin middleware) */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(orders.map(formatAdminOrder));
  } catch (error) {
    console.error('getAllOrders error:', error);
    return res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

/** PUT /api/update_order_status (admin middleware) */
export const updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const orderId = parseInt(id, 10);
    if (!Number.isFinite(orderId) || !status) {
      return res.status(400).json({ error: 'id and status required' });
    }

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, service: true },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toString() },
    });

    if (status.toString().toLowerCase() === 'done') {
      await sendUserEmail({
        to: existing.user.email,
        subject: 'Your order is complete',
        text: `Hello ${existing.user.name},\n\nYour order #${orderId} (${existing.service.title}) is marked as Done. Thank you for choosing Strategy Solutions.`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Status updated successfully',
      order: updated,
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

/** POST /api/thank_you-mail (admin) */
export const thankYouMail = async (req, res) => {
  try {
    const orderId = parseInt(req.body.order_id ?? req.body.orderId, 10);
    if (!Number.isFinite(orderId)) {
      return res.status(400).json({ error: 'order_id required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, service: true },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Active' },
    });

    await sendUserEmail({
      to: order.user.email,
      subject: 'Order received — we are on it',
      text: `Hello ${order.user.name},\n\nYour order #${orderId} (${order.service.title}) is now active. We have received your request and will keep you updated.\n\nStrategy Solutions`,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Order confirmed and email sent',
    });
  } catch (error) {
    console.error('thankYouMail error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** POST /api/done_mail (admin) */
export const doneMail = async (req, res) => {
  try {
    const orderId = parseInt(req.body.order_id ?? req.body.orderId, 10);
    if (!Number.isFinite(orderId)) {
      return res.status(400).json({ error: 'order_id required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, service: true },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Done' },
    });

    await sendUserEmail({
      to: order.user.email,
      subject: 'Order completed',
      text: `Hello ${order.user.name},\n\nYour order #${orderId} (${order.service.title}) is complete. Thank you for your business.\n\nStrategy Solutions`,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Order marked as done and email sent',
    });
  } catch (error) {
    console.error('doneMail error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/** DELETE /api/delete_order */
export const deleteOrder = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (userId == null) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Not logged in' });
    }

    const id = parseInt(req.body.id, 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'id required', message: 'Invalid id' });
    }

    const admin = isAdminReq(req) || req.body.isAdmin === true;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found', message: 'Order not found' });
    }

    if (!admin) {
      if (order.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized' });
      }
      if (order.status !== 'Pending') {
        return res.status(400).json({
          error: 'Only pending orders can be deleted',
          message: 'Can only delete pending orders',
        });
      }
    }

    await prisma.order.delete({ where: { id } });
    return res.status(200).json({
      status: 'success',
      message: 'order deleted successfully',
    });
  } catch (error) {
    console.error('deleteOrder error:', error);
    return res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
