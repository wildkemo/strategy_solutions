/**
 * Admin Authorization Middleware
 * 
 * Purpose: 
 * - Verifies that the authenticated user has administrative privileges.
 * 
 * Logic:
 * - Checks if req.user (populated by checkAuth) has the role 'ADMIN'.
 * - Returns 403 Forbidden if the check fails.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

export default isAdmin;
