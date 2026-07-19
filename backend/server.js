import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cropRoutes from './routes/crops.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration - Allow only the specified frontend origin
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many attempts. Please try again after 15 minutes.' },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false
});

// Log incoming requests for debugging/verification
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Welcome / Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'AgriSarthi Backend API is running smoothly.',
    endpoints: {
      listCrops: 'GET /api/crops',
      searchCrops: 'GET /api/crops/search?q=...',
      cropStats: 'GET /api/crops/stats',
      getCrop: 'GET /api/crops/:id',
      createCrop: 'POST /api/crops',
      updateCrop: 'PUT /api/crops/:id',
      deleteCrop: 'DELETE /api/crops/:id',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me'
    }
  });
});

// Apply rate limiting to Auth endpoints specifically
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);

// Mount routes
app.use('/api/crops', cropRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);


// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found. Check the URL and method.' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌱 AgriSarthi Server listening on port: ${PORT}`);
  console.log(`👉 CORS configured for: ${FRONTEND_URL}`);
  console.log(`==================================================`);
});
