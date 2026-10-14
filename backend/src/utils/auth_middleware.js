/**
 * Authentication Middleware for VibeFinance API
 * Validates cryptographically signed JWT tokens, enforces expiration,
 * and attaches verified user identity to protected route requests.
 */

const security = require('./security');
const userStore = require('./user_store');

/**
 * Strict authentication middleware: Rejects requests with missing or invalid tokens
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid Bearer token in the Authorization header.',
      code: 'UNAUTHORIZED_NO_TOKEN',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.substring(7).trim();
  const verification = security.verifyToken(token);

  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: verification.error || 'Invalid or expired authentication token.',
      code: 'UNAUTHORIZED_INVALID_TOKEN',
      timestamp: new Date().toISOString()
    });
  }

  const user = userStore.findById(verification.payload.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User account associated with this token no longer exists.',
      code: 'UNAUTHORIZED_USER_NOT_FOUND',
      timestamp: new Date().toISOString()
    });
  }

  // Attach verified user identity
  req.user = userStore.sanitizeUser(user);
  next();
}

/**
 * Optional authentication middleware: Attaches user if valid token present, otherwise proceeds
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const verification = security.verifyToken(token);
    if (verification.valid) {
      const user = userStore.findById(verification.payload.userId);
      if (user) {
        req.user = userStore.sanitizeUser(user);
      }
    }
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
