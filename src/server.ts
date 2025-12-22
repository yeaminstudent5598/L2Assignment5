import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';
import { Server as HttpServer } from 'http'; // ইন-বিল্ট লাইব্রেরি
import { Server as SocketServer } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || '';

// HTTP সার্ভার তৈরি
const httpServer = new HttpServer(app);

// Socket.io সেটআপ (CORS সহ)
export const io = new SocketServer(httpServer, {
  cors: {
    origin: "*", // প্রোডাকশনে তোমার ফ্রন্টএন্ড ইউআরএল দিবে
    methods: ["GET", "POST"]
  }
});

// সকেট কানেকশন হ্যান্ডলিং
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // ইউজার যখন কোনো নির্দিষ্ট পার্সেল ট্র্যাক করবে, সে ওই রুম-এ জয়েন করবে
  socket.on('join-parcel', (parcelId: string) => {
    socket.join(parcelId);
    console.log(`User joined room: ${parcelId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

if (!DB_URL) {
  console.error('MongoDB connection string (DB_URL) is missing...');
  process.exit(1);
}

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    // app.listen এর বদলে httpServer.listen ব্যবহার হবে
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });