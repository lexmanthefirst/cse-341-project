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

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `google-${profile.id}@placeholder.com`;
        const domain = email.split('@')[1] || '';

        let role = 'student'; // default role
        if (domain === 'staff.school.com') {
          role = 'teacher';
        } else if (domain === 'admin.school.com') {
          role = 'admin';
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            role,
            provider: 'google',
          });
          console.log(
            'New Google user created:',
            user.name,
            '| Role:',
            user.role,
          );
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    },
  ),
);

module.exports = passport;
