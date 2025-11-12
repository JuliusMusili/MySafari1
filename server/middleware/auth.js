const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const auth = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return res.status(401).json({ message: 'User not found' });
      if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;
