import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || '';

if (!DB_URL) {
  console.error('MongoDB connection string (DB_URL) is missing in environment variables.');
  process.exit(1);
}

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
