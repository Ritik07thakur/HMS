
'use server';

import dbConnect, { User } from '@/lib/mongodb';
import type { IUser } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function getUserDetails(userId: string): Promise<(Omit<IUser, 'password'> & { _id: string; dob: string }) | null> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid ObjectId format for userId:", userId);
    return null;
  }

  try {
    await dbConnect();
    const user = await User.findById(userId).select('-password').lean(); // -password excludes the password field, .lean() returns a plain JS object

    if (!user) {
      return null;
    }

    // Ensure all necessary fields are present and correctly typed
    // Convert MongoDB _id to string and ensure dob is a string representation if needed for client components
    // However, since we are passing to a server component, Date object is fine. For serialization to client, it would be string.
    // For consistency and to match potential client component needs later, let's convert DOB to ISO string.
    return {
      ...user,
      _id: user._id.toString(),
      dob: user.dob instanceof Date ? user.dob.toISOString() : new Date(user.dob).toISOString(), // Ensure dob is a string for consistent prop types
      // Map other fields if necessary, ensuring they are serializable
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      parentPhone: user.parentPhone || '',
      aadhaar: user.aadhaar || '',
      gender: user.gender || 'other',
      address: user.address || '',
    } as (Omit<IUser, 'password'> & { _id: string; dob: string }); // Type assertion

  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}
