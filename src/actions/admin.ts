
'use server';

import dbConnect, { User } from '@/lib/mongodb';
// Ensure IUser is exported from mongodb.ts if you need its full type.
// For this purpose, we only need a subset of fields.

export interface StudentBasicInfo {
  _id: string;
  fullName: string;
  email: string; 
  parentPhone?: string; // Added parentPhone
  address?: string; // Added address
  createdAt?: Date; // Added createdAt
}

export async function getTotalStudentsCount(): Promise<number> {
  try {
    await dbConnect();
    const count = await User.countDocuments({});
    return count;
  } catch (error) {
    console.error('Error fetching total students count:', error);
    // In a real app, you might want to throw the error or handle it more gracefully
    return 0; 
  }
}

export async function getAllStudentsForDashboard(limit?: number): Promise<StudentBasicInfo[]> {
  try {
    await dbConnect();
    // Fetch necessary fields, and limit the results if a limit is provided
    const query = User.find({})
      .select('_id fullName email createdAt parentPhone address') // Added parentPhone and address
      .sort({ createdAt: -1 });

    if (limit && limit > 0) {
      query.limit(limit);
    }
    
    const students = await query.lean(); // .lean() for plain JS objects for better performance

    return students.map(student => ({
      _id: student._id.toString(),
      fullName: student.fullName || 'N/A', // Handle cases where fullName might be missing
      email: student.email || 'N/A',   // Handle cases where email might be missing
      parentPhone: student.parentPhone || 'N/A', // Handle cases where parentPhone might be missing
      address: student.address || 'N/A', // Handle cases where address might be missing
      createdAt: student.createdAt, // Pass createdAt
    }));
  } catch (error) {
    console.error('Error fetching students for dashboard:', error);
    return []; // Return empty array in case of an error
  }
}
