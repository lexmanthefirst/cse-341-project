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
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  (req, res) => {
    // Store user in session manually for custom use
    req.session.user = req.user;
    res.redirect('/');
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
