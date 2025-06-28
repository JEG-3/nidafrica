// Importing necessary modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const authJwt = require('./helper/jwt.js');

// Load environment variables
dotenv.config();


// Middleware 
app.use(cors());
app.options('*', cors()); // Corrected syntax for CORS
app.use(bodyParser.json());
app.use(express.json());
// app.use(authJwt());

// Import routes
const userRoutes = require('./routes/user.js');
const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat'); // Renamed to `subCatRoutes`
const productRoutes = require('./routes/products');

// Static folder for uploaded files
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatRoutes); // Changed to `subCatRoutes`
app.use(`/api/products`, productRoutes);

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING); // Simplified connection
    console.log('MongoDB connected'); 
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Connect to MongoDB
connectToDatabase();

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sample route for testing Cloudinary configuration
app.get('/cloudinary-test', (req, res) => {
  cloudinary.uploader
    .upload('https://res.cloudinary.com/demo/image/upload/v1611183616/sample.jpg')
    .then((result) => {
      res.json({
        message: 'Cloudinary upload successful!',
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error uploading to Cloudinary',
        error: err,
      });
    });
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});