
'use server';
import mongoose, { type Mongoose as MongooseInstanceType } from 'mongoose'; // Renamed Mongoose to MongooseInstanceType
import type { RegisterFormValues } from '@/components/auth/RegisterForm'; // Assuming this type definition path

// IMPORTANT: In a real application, use environment variables for the MongoDB URI.
// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = "mongodb+srv://tritik2307:8kS7kVLgrrTkDizp@cluster0.4mclx89.mongodb.net/HostelManage?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI. For production, use environment variables for security.'
  );
}

interface MongooseCache {
  conn: MongooseInstanceType | null;
  promise: Promise<MongooseInstanceType> | null;
}

// Augment the NodeJS Global type with the mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache;

if (process.env.NODE_ENV === 'production') {
  cached = { conn: null, promise: null };
} else {
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }
  cached = global.mongooseCache;
}

async function dbConnect(): Promise<MongooseInstanceType> {
  if (cached.conn) {
    // console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering mechanism
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
    };
    // console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      // console.log("MongoDB connected successfully.");
      return mongooseInstance;
    }).catch(error => {
      console.error("MongoDB connection error in promise:", error);
      cached.promise = null; // Reset promise on error
      throw error; // Re-throw to be caught by the caller
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // console.error("MongoDB connection error awaiting promise:", e);
    cached.promise = null; // Reset promise on error before re-throwing
    throw e; // Re-throw to be caught by the caller
  }
  
  return cached.conn;
}

export default dbConnect;

// Define User Schema
// Note: RegisterFormValues includes confirmPassword which is not stored.
// We'll define the schema for what's actually stored.
export interface IUser extends Omit<RegisterFormValues, 'confirmPassword'> {
  createdAt?: Date;
  // If you add other Mongoose specific fields like _id, they are handled automatically
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: { type: String, required: [true, "Full name is required"], minlength: 2 },
  email: { type: String, required: [true, "Email is required"], unique: true, trim:true, lowercase: true, match: [/.+\@.+\..+/, "Invalid email address"] },
  password: { type: String, required: [true, "Password is required"], minlength: 6 }, // This will store the hashed password
  phone: { type: String, required: [true, "Phone number is required"], match: [/^\d{10}$/, "Invalid phone number (must be 10 digits)"] },
  parentPhone: { type: String, required: [true, "Parent's phone number is required"], match: [/^\d{10}$/, "Invalid parent's phone number (must be 10 digits)"] },
  gender: { type: String, required: [true, "Gender is required"], enum: ["male", "female", "other"] },
  dob: { type: Date, required: [true, "Date of birth is required"] },
  address: { type: String, required: [true, "Address is required"], minlength: 10, maxlength: 200 },
  aadhaar: { type: String, required: [true, "Aadhaar number is required"], unique: true, match: [/^\d{12}$/, "Aadhaar number must be 12 digits"] },
  createdAt: { type: Date, default: Date.now },
});

// To prevent model recompilation in development with HMR (Hot Module Replacement)
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
