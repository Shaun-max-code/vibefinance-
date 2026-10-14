/**
 * Production Authentication Controller for VibeFinance
 * Implements salted scrypt password hashing, HMAC-SHA256 signed JWT tokens,
 * persistent disk storage, input validation, and strict authorization.
 */

const userStore = require('../utils/user_store');
const security = require('../utils/security');

class AuthController {
  /**
   * Login with email and password
   * Verifies salted scrypt hash and issues cryptographically signed JWT token.
   */
  login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!security.validateEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
        code: 'INVALID_EMAIL_FORMAT',
        timestamp: new Date().toISOString()
      });
    }

    const user = userStore.verifyCredentials(cleanEmail, String(password));

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials or create a new account.',
        code: 'INVALID_CREDENTIALS',
        timestamp: new Date().toISOString()
      });
    }

    // Generate signed, expiring JWT token (24 hours expiry)
    const token = security.generateToken({
      userId: user.id,
      email: user.email,
      workspace: user.workspace
    });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      expires_in: 86400,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspace: user.workspace,
        initials: user.initials || user.name[0],
        risk_profile: user.risk_profile,
        benchmark: user.benchmark || 'S&P 500',
        created_at: user.created_at
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Register a new retail investor account
   * Enforces password length, email syntax, validates uniqueness, and persists securely.
   */
  signup(req, res) {
    const { name, email, password, risk_profile, benchmark } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required.',
        code: 'MISSING_REQUIRED_FIELDS',
        timestamp: new Date().toISOString()
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const rawPassword = String(password);

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters long.',
        code: 'INVALID_NAME',
        timestamp: new Date().toISOString()
      });
    }

    if (!security.validateEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address format (e.g., user@domain.com).',
        code: 'INVALID_EMAIL',
        timestamp: new Date().toISOString()
      });
    }

    const pwCheck = security.validatePassword(rawPassword);
    if (!pwCheck.valid) {
      return res.status(400).json({
        success: false,
        error: pwCheck.error,
        code: 'WEAK_PASSWORD',
        timestamp: new Date().toISOString()
      });
    }

    // Check email uniqueness
    const existing = userStore.findByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
        code: 'EMAIL_ALREADY_EXISTS',
        timestamp: new Date().toISOString()
      });
    }

    try {
      const newUser = userStore.createUser({
        name: cleanName,
        email: cleanEmail,
        password: rawPassword,
        risk_profile: risk_profile || 'Balanced Compounder',
        benchmark: benchmark || 'S&P 500'
      });

      const token = security.generateToken({
        userId: newUser.id,
        email: newUser.email,
        workspace: newUser.workspace
      });

      res.status(201).json({
        success: true,
        message: `Account created successfully! Welcome to VibeFinance, ${newUser.name}.`,
        token,
        expires_in: 86400,
        user: newUser,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to create user account.',
        message: err.message,
        code: 'USER_CREATION_FAILED',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Protected user session endpoint
   * Strictly validates cryptographic signature and rejects unauthorized requests.
   */
  me(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No Bearer token provided in Authorization header.',
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
        error: 'User account not found.',
        code: 'UNAUTHORIZED_USER_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      user: userStore.sanitizeUser(user),
      token_expires_at: new Date(verification.payload.exp * 1000).toISOString(),
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new AuthController();
