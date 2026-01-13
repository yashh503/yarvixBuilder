import User from '../models/User.js';

// Optional auth - attaches user if token exists
export async function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      const user = await User.findOne({
        magicLinkToken: token,
        magicLinkExpiry: { $gt: new Date() }
      });
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore auth errors for optional auth
    }
  }

  next();
}

// Required auth - returns 401 if not authenticated
export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}
