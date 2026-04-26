import prisma from '../utils/prisma.js';

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        service: true,
      },
    });
    // Flatten or map if frontend expects specific format
    const formattedOrders = orders.map(o => ({
      id: o.id,
      email: o.user.email,
      service_type: o.service.title,
      status: o.status,
      created_at: o.createdAt,
    }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Admin & User: Delete order
export const deleteOrder = async (req, res) => {
  const { id, isAdmin } = req.body;
  try {
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If not admin, can only delete pending orders of their own
    if (!isAdmin) {
      if (order.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
      if (order.status !== 'Pending') return res.status(400).json({ message: 'Can only delete pending orders' });
    }

    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};

// Other methods (Request Service, Verify OTP, etc.) would go here...
// Implementing placeholders for consistency with the prompt's focus
export const requestService = async (req, res) => { /* ... */ };
export const verifyOtp = async (req, res) => { /* ... */ };
export const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { service: true }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};
