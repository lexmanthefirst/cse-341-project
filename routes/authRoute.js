const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticateUser = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utilities/tokenBlacklist');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Login with Google (OAuth2)
 *     description: Initiates Google OAuth2 flow
 *     security:
 *       - GoogleOAuth: []  # Reference the security scheme
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
//login with Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth2 Callback
 *     description: Handles the OAuth2 callback from Google
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       302:
 *         description: Redirects to homepage on success
 */
// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return next();
    }

    // Send token to client
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
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Clears the session and logs the user out
 *     responses:
 *       200:
 *         description: Successfully logged out
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
