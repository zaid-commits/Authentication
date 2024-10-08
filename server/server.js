const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); 
const compression = require('compression'); 
const path = require('path');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form'); 
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS for corss origin 
app.use(cors({
    origin: 'https://zoneis.vercel.app', 
    optionsSuccessStatus: 200
}));

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

console.log('MongoDB URI:', process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    });

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes); 

// Welcome route
app.get('/', (req, res) => {
    res.send('Fitness API');
});

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});