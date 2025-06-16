const express = require('express');
const cors = require('cors');
const passport = require('passport');

const routes = require('./routes');
const authRoutes = require('./routes/authRoute');
const setupSwagger = require('./swagger');
const errorMiddleware = require('./middleware/errorMiddleware');
require('./config/passport');

const app = express();

app.set('trust proxy', 1);

// Middleware
app.use(passport.initialize());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: 'https://cse-341-project-m8mw.onrender.com',
    credentials: true,
  }),
);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api', routes);
app.use('/auth', authRoutes);

// Swagger
setupSwagger(app);

// Error Handler
app.use(errorMiddleware);

module.exports = app;
