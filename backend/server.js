const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Allow frontend requests
};

app.use(cors(corsOptions)); // Use CORS without credentials (no cookies)
app.use(express.json({ limit: '500mb' })); // Parse JSON bodies
app.use(express.urlencoded({ limit: '500mb', extended: true })); // Support large requests

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Importing routes
const authRoutes = require('./routes/auth');
const animalsRoute = require('./routes/animals');
const creditRoute = require('./routes/credit');
const employmentRoute = require('./routes/employment');
const productionRoute = require('./routes/production');
const temperatureRouter = require('./routes/temperature');
const waterRouter = require('./routes/water');

// Route mounting
app.use('/auth', authRoutes);
app.use('/data/animals', animalsRoute);
app.use('/data/credit', creditRoute);
app.use('/data/employment', employmentRoute);
app.use('/data/production', productionRoute);
app.use('/data/temperature', temperatureRouter);
app.use('/data/water', waterRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
