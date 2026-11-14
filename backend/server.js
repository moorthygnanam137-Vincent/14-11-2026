require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());

// Serverless functions on Vercel can be frozen between requests, so we
// reuse one MongoDB connection and only open a new one when needed.
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/todos', todoRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Run locally with `npm run dev`. On Vercel, the exported app is used instead.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

module.exports = app;
