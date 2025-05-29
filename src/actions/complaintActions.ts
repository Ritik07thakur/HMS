
'use server';

import { z } from 'zod';
import dbConnect, { Complaint, User } from '@/lib/mongodb';
import type { ComplaintCategory } from '@/lib/mongodb';
import mongoose from 'mongoose';

const ComplaintSchema = z.object({
  studentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid student ID format.",
  }),
  category: z.enum(["Maintenance", "Mess", "Noise", "Security", "Harassment", "Other"], {
    errorMap: () => ({ message: "Please select a valid complaint category." })
  }),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters."),
});

export interface SubmitComplaintPayload {
  studentId: string;
  category: ComplaintCategory;
  description: string;
}

export async function submitComplaint(payload: SubmitComplaintPayload): Promise<{ success: boolean; message: string; complaintId?: string }> {
  const validatedFields = ComplaintSchema.safeParse(payload);

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ');
    return { success: false, message: errorMessages || "Invalid data provided." };
  }

  try {
    await dbConnect();

    // Verify studentId exists
    const studentExists = await User.findById(validatedFields.data.studentId);
    if (!studentExists) {
        return { success: false, message: "Student not found. Invalid student ID." };
    }

    const newComplaint = new Complaint({
      studentId: validatedFields.data.studentId,
      category: validatedFields.data.category,
      description: validatedFields.data.description,
      status: 'Pending', // Default status
    });

    const savedComplaint = await newComplaint.save();

    return { 
      success: true, 
      message: "Complaint submitted successfully!",
      complaintId: savedComplaint._id.toString(),
    };

  } catch (error: any) {
    console.error("Error submitting complaint:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return { success: false, message: `Validation failed: ${messages}` };
    }
    return { success: false, message: "An unexpected error occurred while submitting your complaint. Please try again." };
  }
}
