const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const routes = require('./routes');
const authRoutes = require('./routes/authRoute');
const setupSwagger = require('./swagger');
const errorMiddleware = require('./middleware/errorMiddleware');
require('./config/passport');

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent client-side JS access
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.set('trust proxy', 1); // Trust first proxy for secure cookies in production
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Body Parsers and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://cse-341-project-m8mw.onrender.com',
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  if (req.user) {
    console.log(
      `User ${
        req.user.username || req.user.name || req.user.displayName
      } is logged in`,
    );
  } else {
    console.log('No user is logged in');
  }

  res.send(
    req.user
      ? `Logged in as ${
          req.user.username ||
          req.user.name ||
          req.user.displayName ||
          'Unknown'
        }`
      : 'Logged Out',
  );
});
// Routes
app.use('/api', routes);

// Swagger
setupSwagger(app);

// Error Handler (always last)
app.use(errorMiddleware);

module.exports = app;
