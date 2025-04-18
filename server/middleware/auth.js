const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check token from either Authorization header or cookies
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookie = req.cookies.token;

  const token = tokenFromHeader || tokenFromCookie;

  console.log('Auth Header:', authHeader);
  console.log('Cookie Token:', tokenFromCookie);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token payload');
    }
    req.user = { id: decoded.id }; // Ensure req.user has at least an id
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

module.exports = authMiddleware;