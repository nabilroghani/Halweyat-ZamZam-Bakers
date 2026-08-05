import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import { sampleProducts, sampleCategories } from './data/seedData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/halwiyat_zamzam';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected successfully.');

    // Clear existing collections
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing database entries.');

    // 1. Seed Default Admin & Receptionist Accounts
    const adminUser = new User({
      name: 'Zamzam Owner Admin',
      email: 'admin@zamzam.com',
      password: 'admin123',
      role: 'admin',
      phone: '+92 345 9000123'
    });
    await adminUser.save();

    const receptionistUser = new User({
      name: 'Timergara Counter Staff',
      email: 'reception@zamzam.com',
      password: 'reception123',
      role: 'receptionist',
      phone: '+92 345 9000124'
    });
    await receptionistUser.save();

    console.log('✅ Created Default Admin & Receptionist Users:');
    console.log('   Admin: admin@zamzam.com | Password: admin123');
    console.log('   Receptionist: reception@zamzam.com | Password: reception123');

    // 2. Seed Categories
    const insertedCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Seeded ${insertedCategories.length} categories.`);

    // 3. Seed Products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${insertedProducts.length} products.`);

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.warn('⚠️ Could not connect to local MongoDB for seeding:', error.message);
    console.warn('Backend server will operate seamlessly with built-in mock fallback dataset.');
    process.exit(0);
  }
};

seedDatabase();
