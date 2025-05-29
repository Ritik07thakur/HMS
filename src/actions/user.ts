
'use server';

import dbConnect, { User, Attendance, type IAttendance, type AttendanceStatus } from '@/lib/mongodb';
import type { IUser } from '@/lib/mongodb';
import mongoose from 'mongoose';
import type { StudentMonthlyAttendance, DailyAttendanceStatus } from '@/actions/admin'; // Import from admin actions
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isValid, parseISO } from 'date-fns';

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


export async function getSingleStudentMonthlyAttendance(userId: string): Promise<StudentMonthlyAttendance | null> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid ObjectId format for userId in getSingleStudentMonthlyAttendance:", userId);
    return null;
  }

  try {
    await dbConnect();

    const student = await User.findById(userId).select('_id fullName').lean();
    if (!student) {
      console.warn(`Student not found for ID: ${userId} in getSingleStudentMonthlyAttendance`);
      return null;
    }

    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    const daysInMonthArray = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
    const totalDaysInMonth = daysInMonthArray.length;

    const attendanceRecords: IAttendance[] = await Attendance.find({
      studentId: student._id, 
      date: {
        $gte: currentMonthStart,
        $lte: currentMonthEnd,
      },
    }).lean();

    const attendanceMap = new Map<string, AttendanceStatus>();
    attendanceRecords.forEach(record => {
      const recordDate = record.date instanceof Date ? record.date : parseISO(record.date as unknown as string);
      if (isValid(recordDate)) {
        attendanceMap.set(format(recordDate, 'yyyy-MM-dd'), record.status);
      }
    });

    let presentDays = 0;
    const dailyStatuses: DailyAttendanceStatus[] = daysInMonthArray.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const status = attendanceMap.get(dayString);
      if (status === 'Present') {
        presentDays++;
        return 'P';
      } else if (status === 'Absent') {
        return 'A';
      }
      return '-';
    });

    return {
      studentId: student._id.toString(),
      fullName: student.fullName || 'N/A',
      dailyStatuses, // This might not be directly used in the summary cards but is good to have
      presentDays,
      totalDaysInMonth,
    };

  } catch (error) {
    console.error('Error fetching single student monthly attendance:', error);
    return null;
  }
}
