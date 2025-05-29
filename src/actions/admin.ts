
'use server';

import dbConnect, { User, Attendance, type IAttendance, Complaint, type IComplaint, type ComplaintStatus, type ComplaintCategory } from '@/lib/mongodb'; 
import type { IUser } from '@/lib/mongodb'; 
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isValid, parseISO } from 'date-fns';
import type { AttendanceStatus } from '@/lib/mongodb'; 

export interface StudentBasicInfo {
  _id: string; 
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
      _id: student._id.toString(), 
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

export type DailyAttendanceStatus = 'P' | 'A' | '-'; 

export interface StudentMonthlyAttendance {
  studentId: string;
  fullName: string;
  dailyStatuses: DailyAttendanceStatus[]; 
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
        return {
          studentId: 'UnknownID',
          fullName: student.fullName || 'Unknown Student',
          dailyStatuses: Array(totalDaysInMonth).fill('-') as DailyAttendanceStatus[],
          presentDays: 0,
          totalDaysInMonth,
        };
      }
      const studentIdStr = student._id.toString();

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

export interface PopulatedComplaint {
  _id: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
  } | null; // studentId might not successfully populate if user is deleted
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllComplaints(): Promise<PopulatedComplaint[]> {
  try {
    await dbConnect();
    const complaints = await Complaint.find({})
      .populate<{ studentId: Pick<IUser, '_id' | 'fullName' | 'email'> }>({
        path: 'studentId',
        select: 'fullName email _id', // Select specific fields from User
        model: User // Explicitly provide the User model for population
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Use .lean() for plain JavaScript objects

    return complaints.map(complaint => {
      const populatedStudent = complaint.studentId;
      return {
        _id: complaint._id.toString(),
        student: populatedStudent ? {
          _id: populatedStudent._id!.toString(), // Ensure _id exists and convert to string
          fullName: populatedStudent.fullName || 'N/A',
          email: populatedStudent.email || 'N/A',
        } : null,
        category: complaint.category,
        description: complaint.description,
        status: complaint.status,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    return [];
  }
}
