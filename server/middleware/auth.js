const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user data to the request object
    req.user = verified;

    console.log(req.user); // Check the attached user data (should include username, userId, email, etc.)

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
