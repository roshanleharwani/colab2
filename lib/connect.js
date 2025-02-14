import mongoose from 'mongoose';

if (!mongoose) {
  throw new Error('Mongoose module not found');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Use global cache to store the connection for serverless environments
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log("Connected to MongoDB successfully");
        
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null; // Reset cached promise
        console.error("Failed to connect to MongoDB:", error.message);
        throw new Error('Failed to connect to MongoDB: ' + error.message);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
