// server.js
const app = require('./app');
const connectDB = require('./data/database');

require('dotenv').config();

connectDB();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `Swagger documentation is available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
startServer();
