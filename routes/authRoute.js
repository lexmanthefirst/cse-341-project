const express = require('express');
const router = express.Router();
const passport = require('passport');

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
 *     summary: Redirect to Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects user to Google's OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
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
 *     description: Handles the OAuth2 callback from Google
 *     responses:
 *       302:
 *         description: Redirect on success or failure
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  (req, res) => {
    // Store user in session manually for custom use
    req.session.user = req.user;
    res.redirect('/auth/success');
  },
);

/**
 * @swagger
 * /auth/success:
 *   get:
 *     summary: Auth success
 *     tags: [Authentication]
 *     description: Returns authenticated user info
 *     responses:
 *       200:
 *         description: Authenticated
 *       401:
 *         description: Not authenticated
 */
router.get('/auth/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }
});

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
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: Auth failure
 *     tags: [Authentication]
 *     description: Indicates failed authentication attempt
 *     responses:
 *       401:
 *         description: Authentication failed
 */
router.get('/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Protected route with JWT
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      message: 'JWT Auth Success!',
      user: req.user,
    });
  },
);

module.exports = router;
