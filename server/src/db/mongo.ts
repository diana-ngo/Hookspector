import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI not set in .env file');
}

export const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to Mongo', error);
    throw error;
  }

};
