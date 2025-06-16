const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

// Load environment variables
require('dotenv').config();

/**
 * SESSION: Serialize and Deserialize User
 * These are required for session-based authentication
 */
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/**
 * JWT Strategy
 */
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const validRoles = ['admin', 'teacher', 'student'];
      if (!validRoles.includes(user.role)) {
        return done(null, false, { message: 'Invalid user role' });
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

/**
 * Google OAuth2 Strategy
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value || '';
        const displayName = profile.displayName;

        if (!email) {
          return done(
            new Error('Google profile does not contain an email'),
            false,
          );
        }

        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        // Assign role based on email domain
        const domain = email.split('@')[1];
        let role = 'student';

        if (domain === 'staff.school.com') {
          role = 'teacher';
        } else if (domain === 'admin.school.com') {
          role = 'admin';
        }

        const newUser = new User({
          googleId,
          email,
          name: displayName,
          avatar,
          role,
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

module.exports = passport;
