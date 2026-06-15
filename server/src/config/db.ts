import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongod: MongoMemoryServer | null = null;

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      // Spin up in‑memory server
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('✅ MongoDB (in‑memory) connected');
    } else {
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Graceful shutdown – stop in‑memory server if it was started
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  process.exit(0);
});
