import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  // Define public API routes
  const publicApiRoutes = [
    '/api/login',
    '/api/signup',
    '/api/refresh_token',
    '/api/refresh',
    '/api/health'
  ];
  
  // 1. If it's a public API route, allow it
  if (publicApiRoutes.includes(req.path)) {
    return next();
  }

  // 2. If it's NOT an API route (e.g., static files, frontend routes), allow it
  // This ensures the middleware only protects the API.
  if (!req.path.startsWith('/api')) {
    return next();
  }

  // 3. For all other /api routes, check for a valid JWT
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access_secret_fallback');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export default checkAuth;
