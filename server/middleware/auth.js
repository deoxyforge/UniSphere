const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is empty.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unisphere_secure_jwt_token_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid or has expired.' });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: requires one of the following roles: [${roles.join(', ')}]` });
    }
    next();
  };
};

module.exports = {
  auth,
  verifyStudent: verifyRole(['Student']),
  verifyFaculty: verifyRole(['Faculty']),
  verifyAdmin: verifyRole(['Admin']),
  verifyStaffOrAdmin: verifyRole(['Faculty', 'Admin'])
};
