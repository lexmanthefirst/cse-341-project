const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticateUser = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utilities/tokenBlacklist');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 login
 *     tags: [Authentication]
 *     description: Redirects the user to Google's OAuth2 authorization page.
 *     security:
 *       - googleOAuth: []
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Authentication]
 *     description: Handles the callback from Google and returns a JWT
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 */

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return next();
    }

    res.status(200).json({
      message: 'Authentication successful',
      user: req.user.user,
      token: req.user.token,
    });
  },
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Invalidates the JWT token by adding it to a blacklist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized or token already revoked
 */
router.post('/logout', authenticateUser, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = req.user;

  const expiresIn = Math.floor(decoded.exp - Date.now() / 1000); // In seconds

  if (expiresIn > 0) {
    await addToBlacklist(token, expiresIn);
  }

  res.status(200).json({
    message: 'Logout successful. Token is now invalid.',
  });
});

module.exports = router;
