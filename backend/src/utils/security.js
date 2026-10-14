/**
 * Security & Cryptography Utilities for VibeFinance
 * Implements salted password hashing (scrypt), HMAC-SHA256 signed JWT tokens,
 * timing-safe comparisons, and input validators.
 */

const crypto = require('crypto');

// Default secret fallback if not configured in environment
const DEFAULT_SECRET = 'vibefinance_production_jwt_secret_key_2026_super_secure';

class Security {
  /**
   * Hashes a plaintext password using crypto.scrypt with a unique random salt
   * @param {string} password - Plaintext password
   * @returns {{ hash: string, salt: string }}
   */
  hashPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash, salt };
  }

  /**
   * Securely verifies a password against stored scrypt hash and salt
   * @param {string} password - Plaintext password
   * @param {string} storedHash - Stored hex hash
   * @param {string} salt - Stored hex salt
   * @returns {boolean}
   */
  verifyPassword(password, storedHash, salt) {
    if (!password || !storedHash || !salt) {
      return false;
    }
    try {
      const hashBuffer = crypto.scryptSync(password, salt, 64);
      const storedBuffer = Buffer.from(storedHash, 'hex');
      if (hashBuffer.length !== storedBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(hashBuffer, storedBuffer);
    } catch (e) {
      return false;
    }
  }

  /**
   * Encodes a buffer or string to URL-safe Base64
   */
  base64UrlEncode(str) {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Decodes a URL-safe Base64 string to utf8 string
   */
  base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  /**
   * Generates a cryptographically signed HMAC-SHA256 JWT token with expiration
   * @param {object} payload - Claims to embed
   * @param {string} [secret] - Signing secret (defaults to process.env.JWT_SECRET)
   * @param {number} [expiresInSeconds=86400] - Expiration in seconds (default 24h)
   * @returns {string} - Complete signed JWT token (header.payload.signature)
   */
  generateToken(payload, secret = process.env.JWT_SECRET || DEFAULT_SECRET, expiresInSeconds = 86400) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const enrichedPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
      iss: 'vibefinance-auth-engine'
    };

    const headerEncoded = this.base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = this.base64UrlEncode(JSON.stringify(enrichedPayload));
    const message = `${headerEncoded}.${payloadEncoded}`;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${message}.${signature}`;
  }

  /**
   * Validates and verifies an HMAC-SHA256 signed JWT token
   * @param {string} token - Signed JWT token
   * @param {string} [secret] - Signing secret
   * @returns {{ valid: boolean, payload?: object, error?: string }}
   */
  verifyToken(token, secret = process.env.JWT_SECRET || DEFAULT_SECRET) {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token is required' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;
    const message = `${headerEncoded}.${payloadEncoded}`;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const expectedSigBuffer = Buffer.from(expectedSignature);
      const providedSigBuffer = Buffer.from(signatureProvided);

      if (expectedSigBuffer.length !== providedSigBuffer.length ||
          !crypto.timingSafeEqual(expectedSigBuffer, providedSigBuffer)) {
        return { valid: false, error: 'Cryptographic signature verification failed' };
      }

      const payload = JSON.parse(this.base64UrlDecode(payloadEncoded));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'Token has expired' };
      }

      return { valid: true, payload };
    } catch (err) {
      return { valid: false, error: `Token validation error: ${err.message}` };
    }
  }

  /**
   * Validates standard email format using RFC-compliant pattern
   * @param {string} email
   * @returns {boolean}
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return regex.test(email.trim());
  }

  /**
   * Validates password strength (minimum 8 characters, non-empty)
   * @param {string} password
   * @returns {{ valid: boolean, error?: string }}
   */
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, error: 'Password is required' };
    }
    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters long' };
    }
    return { valid: true };
  }
}

module.exports = new Security();
