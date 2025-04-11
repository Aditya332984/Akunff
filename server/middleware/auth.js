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
    req.user = decoded; // Sets req.user with { id: user._id }
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
