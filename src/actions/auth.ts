
'use server';

import type { RegisterFormValues } from '@/components/auth/RegisterForm';
import { z } from 'zod';
import dbConnect, { User } from '@/lib/mongodb'; // Import dbConnect and User model

// Server-side Zod schema for registration
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
    const hashedPassword = `hashed_${password}`; 
    
    const newUserPayload = {
      email,
      aadhaar,
      ...userData,
      password: hashedPassword,
    };
    
    const newUser = new User(newUserPayload);
    await newUser.save();

    return { success: true, message: "Registration successful! Welcome." };

  } catch (error: any) {
    console.error("Error during user registration:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return { success: false, message: `Validation failed: ${messages}` };
    }
    if (error.code === 11000) { 
        let field = Object.keys(error.keyValue)[0];
        field = field === 'email' ? 'Email address' : field === 'aadhaar' ? 'Aadhaar number' : field;
        return { success: false, message: `${field} is already registered.` };
    }

    return { success: false, message: "An error occurred during registration. Please try again." };
  }
}

// Server-side Zod schema for login
const LoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."), 
});

export async function loginUser(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid email or password format." };
  }

  const { email, password } = validatedFields.data;

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return { success: false, message: "Invalid email or password." }; // Generic message for security
    }

    // IMPORTANT: Simulate password check. In production, use bcrypt.compare
    // This assumes the password stored during registration was `hashed_${originalPassword}`
    const isPasswordMatch = existingUser.password === `hashed_${password}`;

    if (!isPasswordMatch) {
      return { success: false, message: "Invalid email or password." }; // Generic message
    }

    // Successfully authenticated
    return {
      success: true,
      message: "Login successful! Redirecting...",
      data: {
        userId: existingUser._id.toString(), // Mongoose _id needs to be converted to string
        // You can add other user data here if needed, e.g., name, role
        // email: existingUser.email,
        // fullName: existingUser.fullName,
      },
    };

  } catch (error: any) {
    console.error("Error during login:", error);
    return { success: false, message: "An error occurred during login. Please try again." };
  }
}
