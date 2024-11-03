require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors'); 
const vocabRoutes = require('./routes/vocabRoutes');
const userRoutes = require('./routes/userRoutes'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Use the CORS middleware

// Connect to the database
connectDB();
// Use routes
app.use('/api', vocabRoutes);
app.use('/api', userRoutes); // Add user routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
