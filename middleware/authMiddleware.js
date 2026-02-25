const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
exports.authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Received Token:', token);

  if (!token || !token.startsWith('Bearer ')) {
    console.log(token);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const tokenWithoutBearer = token.slice(7); // Remove "Bearer " prefix
  // console.log(tokenWithoutBearer);
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
  
    console.log('Decoded User:', user);
    req.user = user;
    next();
  });
  
};