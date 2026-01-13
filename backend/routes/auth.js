import { Router } from 'express';
import { nanoid } from 'nanoid';
import User from '../models/User.js';
import Site from '../models/Site.js';
import { sendMagicLink } from '../utils/email.js';

const router = Router();

// POST /auth/magic-link - Send magic link email
router.post('/magic-link', async (req, res) => {
  try {
    const { email, draftToken } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({ email: email.toLowerCase() });
    }

    // Generate magic link token (valid for 15 minutes)
    const token = nanoid(32);
    user.magicLinkToken = token;
    user.magicLinkExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Send magic link email
    await sendMagicLink(email, token);

    res.json({ message: 'Magic link sent to your email' });
  } catch (err) {
    console.error('Magic link error:', err);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

// POST /auth/verify - Verify magic link token
router.post('/verify', async (req, res) => {
  try {
    const { token, email, draftToken } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: 'Token and email are required' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      magicLinkToken: token,
      magicLinkExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired magic link' });
    }

    // Extend token validity (24 hours session)
    user.magicLinkExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // If there's a draft token, link that site to this user
    if (draftToken) {
      const site = await Site.findOne({ draftToken });
      if (site && !site.owner) {
        site.owner = user._id;
        await site.save();
        user.sites.push(site._id);
        await user.save();
      }
    }

    res.json({
      message: 'Authenticated successfully',
      token: user.magicLinkToken,
      email: user.email
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await User.updateOne(
        { magicLinkToken: token },
        { $set: { magicLinkToken: null, magicLinkExpiry: null } }
      );
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
