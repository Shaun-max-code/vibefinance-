/**
 * Persistent User Store for VibeFinance
 * Persists user records with cryptographic password hashes (scrypt) to disk (users_store.json).
 * Preserves user accounts across server restarts.
 */

const fs = require('fs');
const path = require('path');
const security = require('./security');

const STORE_PATH = path.join(__dirname, '../data/users_store.json');

class UserStore {
  constructor() {
    this.storePath = STORE_PATH;
    this.initStore();
  }

  /**
   * Initializes the JSON user store file if it does not exist
   */
  initStore() {
    try {
      if (!fs.existsSync(this.storePath)) {
        // Seed default initial user with properly hashed password
        const defaultPassword = 'password123';
        const { hash, salt } = security.hashPassword(defaultPassword);

        const defaultUsers = [
          {
            id: 'user-shaun',
            name: 'Shaun Mathew',
            email: 'shaunmathew@example.com',
            password_hash: hash,
            password_salt: salt,
            workspace: 'Personal workspace',
            initials: 'S',
            risk_profile: 'Balanced Compounder',
            benchmark: 'S&P 500',
            created_at: '2026-01-15T09:00:00.000Z',
            updated_at: '2026-01-15T09:00:00.000Z'
          }
        ];

        fs.writeFileSync(this.storePath, JSON.stringify(defaultUsers, null, 2), 'utf8');
      }
    } catch (err) {
      console.error('Failed to initialize user store file:', err.message);
    }
  }

  /**
   * Reads all users from persistent JSON file
   * @returns {Array<object>}
   */
  readUsers() {
    try {
      if (!fs.existsSync(this.storePath)) {
        this.initStore();
      }
      const raw = fs.readFileSync(this.storePath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading user store:', err.message);
      return [];
    }
  }

  /**
   * Writes users array to disk atomically
   * @param {Array<object>} users
   */
  writeUsers(users) {
    try {
      const tempPath = `${this.storePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(users, null, 2), 'utf8');
      fs.renameSync(tempPath, this.storePath);
      return true;
    } catch (err) {
      console.error('Error writing user store:', err.message);
      return false;
    }
  }

  /**
   * Finds a user by email (case-insensitive)
   * @param {string} email
   * @returns {object|null}
   */
  findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = this.readUsers();
    return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  /**
   * Finds a user by ID
   * @param {string} id
   * @returns {object|null}
   */
  findById(id) {
    if (!id) return null;
    const users = this.readUsers();
    return users.find(u => u.id === id) || null;
  }

  /**
   * Creates and persists a new user with hashed password
   * @param {object} userData
   * @returns {object} Sanitized user
   */
  createUser({ name, email, password, risk_profile, benchmark }) {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.findByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const { hash, salt } = security.hashPassword(password);
    const users = this.readUsers();

    const newUser = {
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: cleanEmail,
      password_hash: hash,
      password_salt: salt,
      workspace: `${name.trim()}'s Workspace`,
      initials: name.trim()[0].toUpperCase(),
      risk_profile: risk_profile || 'Balanced Compounder',
      benchmark: benchmark || 'S&P 500',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    this.writeUsers(users);

    return this.sanitizeUser(newUser);
  }

  /**
   * Deletes a user by ID (useful for testing/cleanup)
   * @param {string} id
   * @returns {boolean}
   */
  deleteUserById(id) {
    if (!id) return false;
    const users = this.readUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length !== users.length) {
      this.writeUsers(filtered);
      return true;
    }
    return false;
  }

  /**
   * Verifies credentials against hashed password and salt
   * @param {string} email
   * @param {string} password
   * @returns {object|null} Sanitized user or null
   */
  verifyCredentials(email, password) {
    const user = this.findByEmail(email);
    if (!user) {
      return null;
    }

    // Verify hashed password using scrypt
    const isValid = security.verifyPassword(password, user.password_hash, user.password_salt);
    if (!isValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  /**
   * Removes sensitive cryptographic hashes and salts before returning user object
   * @param {object} user
   * @returns {object}
   */
  sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, password_salt, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = new UserStore();
