const authMiddleware = require('./authMiddleware');

/**
 * Middleware to ensure the authenticated user has ADMIN role.
 * Wraps authMiddleware first to ensure valid JWT session.
 */
async function requireAdmin(req, res, next) {
  authMiddleware(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin privileges required to access this resource.',
      });
    }

    next();
  });
}

module.exports = {
  requireAdmin,
};
