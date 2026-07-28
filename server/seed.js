import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { sampleProducts } from './data/seedData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/halwiyat_zamzam';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected.');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} products into database!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
