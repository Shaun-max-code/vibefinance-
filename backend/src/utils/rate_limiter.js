/**
 * Rate Limiting Middleware for VibeFinance API
 * Provides sliding-window IP rate limiting to protect authentication and intelligence endpoints.
 */

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60 * 1000; // 1 minute default
    this.maxRequests = options.maxRequests || 60; // 60 requests per window
    this.hits = new Map();

    // Periodic cleanup of expired clients every 2 minutes
    this.cleanupTimer = setInterval(() => this.cleanup(), 2 * 60 * 1000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.hits.entries()) {
      const active = timestamps.filter(t => t > now - this.windowMs);
      if (active.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, active);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      const clientKey = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-client';
      const now = Date.now();
      const clientTimestamps = this.hits.get(clientKey) || [];

      // Filter out timestamps outside the active window
      const validTimestamps = clientTimestamps.filter(t => t > now - this.windowMs);

      if (validTimestamps.length >= this.maxRequests) {
        const oldestTimestamp = validTimestamps[0];
        const resetTimeMs = oldestTimestamp + this.windowMs - now;
        const retryAfterSeconds = Math.max(1, Math.ceil(resetTimeMs / 1000));

        res.set({
          'Retry-After': String(retryAfterSeconds),
          'X-RateLimit-Limit': String(this.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil((now + resetTimeMs) / 1000))
        });

        return res.status(429).json({
          success: false,
          error: `Too many requests from this IP. Please try again in ${retryAfterSeconds} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retry_after_seconds: retryAfterSeconds,
          timestamp: new Date().toISOString()
        });
      }

      validTimestamps.push(now);
      this.hits.set(clientKey, validTimestamps);

      res.set({
        'X-RateLimit-Limit': String(this.maxRequests),
        'X-RateLimit-Remaining': String(Math.max(0, this.maxRequests - validTimestamps.length)),
        'X-RateLimit-Reset': String(Math.ceil((now + this.windowMs) / 1000))
      });

      next();
    };
  }
}

// Preset rate limiters
const authLimiter = new RateLimiter({ windowMs: 60 * 1000, maxRequests: 15 }); // 15 login/signup tries/min
const apiLimiter = new RateLimiter({ windowMs: 60 * 1000, maxRequests: 120 }); // 120 general requests/min

module.exports = {
  RateLimiter,
  authLimiter: authLimiter.middleware(),
  apiLimiter: apiLimiter.middleware()
};
