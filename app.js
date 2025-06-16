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
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }),
);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Body Parsers and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/api', routes);

// Swagger
setupSwagger(app);

// Error Handler (always last)
app.use(errorMiddleware);

module.exports = app;
