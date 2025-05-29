
'use server';

import dbConnect, { User, Attendance, type IAttendance, type AttendanceStatus } from '@/lib/mongodb';
import type { IUser } from '@/lib/mongodb'; // Ensure IUser is imported
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isValid, parseISO } from 'date-fns';

export interface StudentBasicInfo {
  _id: string; // Ensuring _id is string
  fullName: string;
  email: string; 
  parentPhone?: string;
  address?: string;
  createdAt?: Date;
}

export async function getTotalStudentsCount(): Promise<number> {
  try {
    await dbConnect();
    const count = await User.countDocuments({});
    return count;
  } catch (error) {
    console.error('Error fetching total students count:', error);
    return 0; 
  }
}

export async function getAllStudentsForDashboard(limit?: number): Promise<StudentBasicInfo[]> {
  try {
    await dbConnect();
    const query = User.find({})
      .select('_id fullName email createdAt parentPhone address')
      .sort({ createdAt: -1 });

    if (limit && limit > 0) {
      query.limit(limit);
    }
    
    const students = await query.lean();

    return students.map(student => ({
      _id: student._id.toString(), // Convert ObjectId to string
      fullName: student.fullName || 'N/A',
      email: student.email || 'N/A',
      parentPhone: student.parentPhone || 'N/A',
      address: student.address || 'N/A',
      createdAt: student.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching students for dashboard:', error);
    return [];
  }
}

export type DailyAttendanceStatus = 'P' | 'A' | 'L' | '-'; // '-' for no record

export interface StudentMonthlyAttendance {
  studentId: string;
  fullName: string;
  dailyStatuses: DailyAttendanceStatus[]; // Array of statuses for each day of the month
  presentDays: number;
  totalDaysInMonth: number;
}

export async function getStudentAttendanceForCurrentMonth(): Promise<StudentMonthlyAttendance[]> {
  try {
    await dbConnect();

    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    const daysInMonthArray = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
    const totalDaysInMonth = daysInMonthArray.length;

    const students: Pick<IUser, '_id' | 'fullName'>[] = await User.find({}).select('_id fullName').lean();
    
    const studentAttendancePromises = students.map(async (student) => {
      if (!student._id) {
        // This case should ideally not happen if data is clean
        return {
          studentId: 'UnknownID',
          fullName: student.fullName || 'Unknown Student',
          dailyStatuses: Array(totalDaysInMonth).fill('-') as DailyAttendanceStatus[],
          presentDays: 0,
          totalDaysInMonth,
        };
      }
      const studentIdStr = student._id.toString();

      // Fetch all attendance records for this student for the current month
      const attendanceRecords: IAttendance[] = await Attendance.find({
        studentId: student._id,
        date: {
          $gte: currentMonthStart,
          $lte: currentMonthEnd,
        },
      }).lean();

      // Create a map for quick lookup: dateString -> status
      const attendanceMap = new Map<string, AttendanceStatus>();
      attendanceRecords.forEach(record => {
        // Ensure date is valid before formatting. Handle potential string dates from DB if not properly typed.
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
        } else if (status === 'Leave') {
          return 'L';
        }
        return '-'; // No record for this day
      });

      return {
        studentId: studentIdStr,
        fullName: student.fullName || 'N/A',
        dailyStatuses,
        presentDays,
        totalDaysInMonth,
      };
    });

    return Promise.all(studentAttendancePromises);

  } catch (error) {
    console.error('Error fetching student monthly attendance:', error);
    return [];
  }
}
