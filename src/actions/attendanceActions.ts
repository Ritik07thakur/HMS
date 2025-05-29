
'use server';

import dbConnect, { User, Attendance, type IAttendance, type AttendanceStatus } from '@/lib/mongodb';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import type { Types } from 'mongoose';

export interface StudentForAttendanceMarking {
  _id: string;
  fullName: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus; // This type is now 'Present' | 'Absent'
}

/**
 * Fetches all students with their ID and full name for attendance marking.
 */
export async function getStudentsForAttendanceMarking(): Promise<StudentForAttendanceMarking[]> {
  try {
    await dbConnect();
    const students = await User.find({}).select('_id fullName').lean();
    return students.map(student => ({
      _id: student._id.toString(),
      fullName: student.fullName || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching students for attendance:', error);
    return [];
  }
}

/**
 * Fetches existing attendance records for a specific date.
 * @param date The specific date (as a Date object) for which to fetch records.
 */
export async function getAttendanceRecordsForDate(date: Date): Promise<AttendanceRecord[]> {
  try {
    await dbConnect();
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const records = await Attendance.find({
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    }).select('studentId status').lean();
    
    return records.map(record => ({
      studentId: record.studentId.toString(),
      status: record.status, // status will be 'Present' or 'Absent'
    }));
  } catch (error) {
    console.error('Error fetching attendance records for date:', error);
    return [];
  }
}

export interface DailyAttendancePayload {
  date: Date; // Date object from client
  records: Array<{ studentId: string; status: AttendanceStatus }>; // status is 'Present' | 'Absent'
}

/**
 * Saves or updates daily attendance records for multiple students.
 * @param payload Contains the date and an array of student attendance records.
 */
export async function saveOrUpdateDailyAttendance(payload: DailyAttendancePayload): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    const { date, records } = payload;

    if (!date || !records || records.length === 0) {
      return { success: false, message: "Invalid payload: Date and records are required." };
    }
    
    // Ensure the date is treated as the start of the day for consistency in storage/querying
    const attendanceDate = startOfDay(new Date(date));


    const operations = records.map(record => ({
      updateOne: {
        filter: { studentId: record.studentId, date: attendanceDate },
        update: { $set: { status: record.status, studentId: record.studentId, date: attendanceDate } }, // ensure studentId and date are set on upsert
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(operations);

    if (result.ok) {
      return { success: true, message: `Attendance for ${attendanceDate.toLocaleDateString()} saved successfully. Processed: ${result.nUpserted + result.nModified} records.` };
    } else {
      console.error("Bulk write error details:", result);
      return { success: false, message: "Some records might not have been saved. Please check." };
    }

  } catch (error: any) {
    console.error('Error saving daily attendance:', error);
    // Check for specific MongoDB errors if needed, e.g., validation errors
    if (error.name === 'MongoBulkWriteError' && error.code === 11000) { // Mongoose 6+ error structure might differ slightly
         return { success: false, message: "A duplicate key error occurred. This might happen with concurrent requests." };
    }
    return { success: false, message: error.message || "An unexpected error occurred while saving attendance." };
  }
}

