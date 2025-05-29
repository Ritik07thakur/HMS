
'use server';

import type { RegisterFormValues } from '@/components/auth/RegisterForm';
import { z } from 'zod';

// This is a simplified schema for server-side validation, 
// matching the structure of RegisterFormValues.
// In a real app, you might have more complex or slightly different server-side validation.
const ServerRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  // confirmPassword is not needed on the server after client validation
  phone: z.string().length(10),
  parentPhone: z.string().length(10),
  gender: z.enum(["male", "female", "other"]),
  dob: z.date(),
  address: z.string().min(10).max(200),
  aadhaar: z.string().length(12),
});

// Mock database of emails and aadhaar numbers to simulate uniqueness checks
const mockExistingEmails = new Set(['test@example.com', 'admin@example.com']);
const mockExistingAadhaars = new Set(['123456789012']);

export async function registerUser(values: RegisterFormValues) {
  // 1. Validate input data (Zod on server-side for robustness)
  const validatedFields = ServerRegisterSchema.safeParse({
    fullName: values.fullName,
    email: values.email,
    password: values.password, // Password would be hashed before saving
    phone: values.phone,
    parentPhone: values.parentPhone,
    gender: values.gender,
    dob: values.dob,
    address: values.address,
    aadhaar: values.aadhaar,
  });

  if (!validatedFields.success) {
    console.error("Server-side validation failed:", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data provided. Please check your input." };
  }

  const { email, aadhaar, password, ...userData } = validatedFields.data;

  // 2. Check for uniqueness (mocked)
  if (mockExistingEmails.has(email)) {
    return { success: false, message: "This email address is already registered." };
  }
  if (mockExistingAadhaars.has(aadhaar)) {
    return { success: false, message: "This Aadhaar number is already registered." };
  }

  // 3. Password Hashing (simulated)
  // In a real application, use a library like bcrypt:
  // const hashedPassword = await bcrypt.hash(password, 10);
  // For this mock, we'll just acknowledge it.
  const hashedPassword = `hashed_${password}`; 
  console.log("Simulating password hashing. Original:", password, "Hashed:", hashedPassword);

  // 4. Simulate saving to database
  const newUser = {
    id: Date.now().toString(), // Mock ID
    email,
    aadhaar,
    ...userData,
    // password: hashedPassword, // Store the hashed password
    createdAt: new Date(),
  };

  console.log("Simulating user registration. User data to save:", newUser);
  // Here you would typically interact with your database (e.g., Prisma, Drizzle, or MongoDB driver)
  // For example: await db.user.create({ data: newUser });

  // Add the new email and aadhaar to our mock sets for future checks in this session
  mockExistingEmails.add(email);
  mockExistingAadhaars.add(aadhaar);

  return { success: true, message: "Registration successful! Welcome." };
}

    