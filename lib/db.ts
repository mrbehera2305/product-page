import mongoose from 'mongoose';
import { Product, StoreSettings, User, Review, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_USERS, INITIAL_REVIEWS, INITIAL_ORDERS } from './seedData';

// Global state container for fallback in-memory database mode
declare global {
  var _inMemoryStore: {
    users: User[];
    products: Product[];
    reviews: Review[];
    orders: Order[];
    settings: StoreSettings;
    wishlists: Record<string, string[]>; // userId -> array of productId
  } | undefined;
}

if (!global._inMemoryStore) {
  global._inMemoryStore = {
    users: [...INITIAL_USERS],
    products: [...INITIAL_PRODUCTS],
    reviews: [...INITIAL_REVIEWS],
    orders: [...INITIAL_ORDERS],
    settings: { ...INITIAL_SETTINGS },
    wishlists: {
      "usr_cust_1": ["prod_1", "prod_5"]
    }
  };
}

export const getStore = () => {
  return global._inMemoryStore!;
};

// Database connector
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (MONGODB_URI) {
    try {
      if (mongoose.connection.readyState >= 1) {
        return;
      }
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to built-in memory store:', err);
    }
  }
}
