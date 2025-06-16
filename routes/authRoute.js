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

// @desc: Google OAuth callback
// @route: GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success',
  }),
);

// @desc: Auth success route
router.get('/success', (req, res) => {
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
 *     description: Clears the session and invalidates the JWT token
 *     responses:
 *       302:
 *         description: Redirect to success page
 *       401:
 *         description: User not authenticated
 */
// @desc: Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// @desc: Auth failure route
router.get('/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

/**
 * @swagger
 * /user/protected:
 *   get:
 *     summary: Test protected route with JWT
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Authorized user access
 *       401:
 *         description: Unauthorized
 */

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      message: 'JWT Auth Success!',
      user: req.user, // Populated from JWT payload
    });
  },
);

module.exports = router;
