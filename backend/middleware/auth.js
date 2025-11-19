const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const useMemory = req.app?.locals?.dbConnected === false;
    if (useMemory) {
      const store = req.app.locals.memoryStore;
      const user = store.users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
      req.role = user.role;
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    req.role = user.role;
    next();
  } catch (err) {
    console.error('auth middleware error:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.role) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!roles.includes(req.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, requireRole };
