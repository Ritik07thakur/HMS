
'use server';

import dbConnect, { User } from '@/lib/mongodb';
// Ensure IUser is exported from mongodb.ts if you need its full type.
// For this purpose, we only need a subset of fields.

export interface StudentBasicInfo {
  _id: string;
  fullName: string;
  email: string; 
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

export async function getAllStudentsForDashboard(limit: number = 10): Promise<StudentBasicInfo[]> {
  try {
    await dbConnect();
    // Fetch only necessary fields, and limit the results for dashboard display
    const students = await User.find({})
      .select('_id fullName email') // Select only _id, fullName, and email
      .limit(limit)
      .sort({ createdAt: -1 }) // Optional: get the latest registered students
      .lean(); // .lean() for plain JS objects for better performance

    return students.map(student => ({
      _id: student._id.toString(),
      fullName: student.fullName || 'N/A', // Handle cases where fullName might be missing
      email: student.email || 'N/A',   // Handle cases where email might be missing
    }));
  } catch (error) {
    console.error('Error fetching students for dashboard:', error);
    return []; // Return empty array in case of an error
  }
}
