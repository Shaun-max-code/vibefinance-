/**
 * Authentication Controller for VibeFinance
 * Supports login for existing users and registration for new retail investors.
 */

const userProfileData = require('../data/user_profile.json');

// In-memory synthetic user database seeded with default user
let usersDatabase = [
  {
    id: 'user-shaun',
    name: 'Shaun Mathew',
    email: 'shaunmathew@example.com',
    password: 'password123',
    workspace: 'Personal workspace',
    initials: 'S',
    risk_profile: 'Balanced Compounder',
    benchmark: 'S&P 500',
    created_at: '2026-01-15T09:00:00Z'
  }
];

class AuthController {
  /**
   * Login for existing users
   */
  login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please check your credentials or create a new account.'
      });
    }

    // In demo environment, match password or accept standard password
    if (user.password && user.password !== password && password !== 'password123') {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. (Tip: Demo password is password123)'
      });
    }

    const token = `vibe_jwt_${Buffer.from(user.email).toString('base64')}_${Date.now()}`;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspace: user.workspace,
        initials: user.initials || user.name[0],
        risk_profile: user.risk_profile,
        benchmark: user.benchmark || 'S&P 500'
      }
    });
  }

  /**
   * Signup for new users
   */
  signup(req, res) {
    const { name, email, password, risk_profile, benchmark } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Please log in instead.'
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      workspace: `${name.trim()}'s Workspace`,
      initials: name.trim()[0].toUpperCase(),
      risk_profile: risk_profile || 'Balanced Compounder',
      benchmark: benchmark || 'S&P 500',
      created_at: new Date().toISOString()
    };

    usersDatabase.push(newUser);

    const token = `vibe_jwt_${Buffer.from(newUser.email).toString('base64')}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: `Account created successfully! Welcome to VibeFinance, ${newUser.name}.`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        workspace: newUser.workspace,
        initials: newUser.initials,
        risk_profile: newUser.risk_profile,
        benchmark: newUser.benchmark
      }
    });
  }

  /**
   * Get currently active or default profile
   */
  me(req, res) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer vibe_jwt_')) {
      try {
        const parts = authHeader.split('_');
        const email = Buffer.from(parts[2], 'base64').toString('ascii');
        const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          return res.json({ success: true, user });
        }
      } catch (e) {}
    }

    // Default Shaun Mathew profile
    res.json({
      success: true,
      user: usersDatabase[0]
    });
  }
}

module.exports = new AuthController();
