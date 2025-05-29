
'use server';

import type { RegisterFormValues } from '@/components/auth/RegisterForm';
import { z } from 'zod';
import dbConnect, { User } from '@/lib/mongodb'; // Import dbConnect and User model

// Server-side Zod schema for initial validation and type shaping.
// Mongoose schema will provide database-level validation.
const ServerRegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().length(10, "Phone number must be 10 digits."),
  parentPhone: z.string().length(10, "Parent's phone number must be 10 digits."),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "Gender is required."}) }),
  dob: z.date({ errorMap: () => ({ message: "Date of birth is required."}) }),
  address: z.string().min(10, "Address must be at least 10 characters.").max(200, "Address cannot exceed 200 characters."),
  aadhaar: z.string().length(12, "Aadhaar number must be 12 digits."),
});

export async function registerUser(values: RegisterFormValues) {
  // 1. Validate input data with Zod
  const validatedFields = ServerRegisterSchema.safeParse({
    fullName: values.fullName,
    email: values.email,
    password: values.password,
    phone: values.phone,
    parentPhone: values.parentPhone,
    gender: values.gender,
    dob: values.dob,
    address: values.address,
    aadhaar: values.aadhaar,
  });

  if (!validatedFields.success) {
    console.error("Server-side Zod validation failed:", validatedFields.error.flatten().fieldErrors);
    // Construct a user-friendly message from Zod errors
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ');
    return { success: false, message: errorMessages || "Invalid data provided. Please check your input." };
  }

  const { email, aadhaar, password, ...userData } = validatedFields.data;

  try {
    // 2. Connect to the database
    await dbConnect();

    // 3. Check for uniqueness (email and Aadhaar)
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return { success: false, message: "This email address is already registered." };
    }

    const existingUserByAadhaar = await User.findOne({ aadhaar });
    if (existingUserByAadhaar) {
      return { success: false, message: "This Aadhaar number is already registered." };
    }

    // 4. Password Hashing (simulated - IMPORTANT: use bcryptjs or similar in production)
    // In a real application, use a library like bcrypt:
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = `hashed_${password}`; // Keep simulation for now
    // console.log("Simulating password hashing. Original:", password, "Hashed:", hashedPassword);

    // 5. Create and save the new user to the database
    const newUserPayload = {
      email,
      aadhaar,
      ...userData,
      password: hashedPassword, // Store the "hashed" password
      // createdAt is handled by Mongoose schema default
    };
    
    const newUser = new User(newUserPayload);
    await newUser.save();

    // console.log("User registered successfully and saved to MongoDB:", newUser);

    return { success: true, message: "Registration successful! Welcome." };

  } catch (error: any) {
    console.error("Error during user registration:", error);
    
    // Handle Mongoose validation errors or duplicate key errors specifically if needed
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return { success: false, message: `Validation failed: ${messages}` };
    }
    if (error.code === 11000) { // MongoDB duplicate key error
        let field = Object.keys(error.keyValue)[0];
        field = field === 'email' ? 'Email address' : field === 'aadhaar' ? 'Aadhaar number' : field;
        return { success: false, message: `${field} is already registered.` };
    }

    return { success: false, message: "An error occurred during registration. Please try again." };
  }
}
