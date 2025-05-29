
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ListPlus, Save } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  getStudentsForAttendanceMarking, 
  getAttendanceRecordsForDate, 
  saveOrUpdateDailyAttendance,
  type StudentForAttendanceMarking,
} from "@/actions/attendanceActions"; 
import type { AttendanceStatus } from "@/lib/mongodb"; // Import updated AttendanceStatus

export default function MarkAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfDay(new Date()));
  const [students, setStudents] = useState<StudentForAttendanceMarking[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchStudents() {
      setIsLoadingStudents(true);
      try {
        const studentList = await getStudentsForAttendanceMarking();
        setStudents(studentList);
        const initialAttendance: Record<string, AttendanceStatus> = {};
        studentList.forEach(student => {
          initialAttendance[student._id] = 'Present'; // Default to 'Present'
        });
        setAttendanceData(initialAttendance);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch students.", variant: "destructive" });
      } finally {
        setIsLoadingStudents(false);
      }
    }
    fetchStudents();
  }, [toast]);

  useEffect(() => {
    if (!selectedDate || students.length === 0) return;

    async function fetchAttendanceForSelectedDate() {
      setIsLoadingAttendance(true);
      try {
        const records = await getAttendanceRecordsForDate(selectedDate);
        const newAttendanceData: Record<string, AttendanceStatus> = {};
        students.forEach(student => {
          newAttendanceData[student._id] = 'Present'; // Default
        });
        records.forEach(record => {
          // Ensure status is one of the valid 'Present' | 'Absent'
          if (record.status === 'Present' || record.status === 'Absent') {
            newAttendanceData[record.studentId] = record.status;
          } else {
             // If somehow an invalid status is fetched (e.g. old 'Leave' data), default to 'Present'
            newAttendanceData[record.studentId] = 'Present';
          }
        });
        setAttendanceData(newAttendanceData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch existing attendance records.", variant: "destructive" });
      } finally {
        setIsLoadingAttendance(false);
      }
    }
    fetchAttendanceForSelectedDate();
  }, [selectedDate, students, toast]);

  const handleStatusChange = (studentId: string, status: string) => {
    // Ensure status is 'Present' or 'Absent' before setting
    if (status === 'Present' || status === 'Absent') {
        setAttendanceData(prev => ({ ...prev, [studentId]: status as AttendanceStatus }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedDate) {
      toast({ title: "Error", description: "Please select a date.", variant: "destructive" });
      return;
    }
    if (students.length === 0) {
        toast({ title: "Info", description: "No students to mark attendance for.", variant: "default" });
        return;
    }

    setIsSubmitting(true);
    const recordsToSave = students.map(student => ({
      studentId: student._id,
      status: attendanceData[student._id] || 'Present', // Default if somehow not set
    }));

    try {
      const result = await saveOrUpdateDailyAttendance({ date: selectedDate, records: recordsToSave });
      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="h-6 w-6 text-primary" />
            Mark Daily Attendance
          </CardTitle>
          <CardDescription>
            Select a date and mark attendance for each student. Default status is &apos;Present&apos;.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-grow sm:max-w-xs">
                    <Label htmlFor="attendance-date" className="mb-2 block text-sm font-medium">Select Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="attendance-date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                            )}
                            suppressHydrationWarning
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => setSelectedDate(date ? startOfDay(date) : undefined)}
                            initialFocus
                            disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <Button type="submit" disabled={isSubmitting || isLoadingStudents || isLoadingAttendance} className="mt-auto sm:mt-0 w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Attendance"}
                </Button>
            </div>

            {isLoadingStudents ? (
              <p className="text-center text-muted-foreground py-4">Loading students...</p>
            ) : students.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No students found to mark attendance.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Student Name</TableHead>
                      <TableHead className="text-center w-[250px]">Status (P / A)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingAttendance ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                                Loading attendance data for {selectedDate ? format(selectedDate, "PPP") : "selected date"}...
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell className="font-medium">{student.fullName}</TableCell>
                            <TableCell className="text-center">
                            <RadioGroup
                                value={attendanceData[student._id] || 'Present'}
                                onValueChange={(value) => handleStatusChange(student._id, value as AttendanceStatus)}
                                className="flex justify-center space-x-2 sm:space-x-4"
                                suppressHydrationWarning
                            >
                                <div className="flex items-center space-x-1">
                                <RadioGroupItem value="Present" id={`${student._id}-present`} />
                                <Label htmlFor={`${student._id}-present`} className="text-xs sm:text-sm cursor-pointer">Present</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                <RadioGroupItem value="Absent" id={`${student._id}-absent`} />
                                <Label htmlFor={`${student._id}-absent`} className="text-xs sm:text-sm cursor-pointer">Absent</Label>
                                </div>
                                {/* 'Leave' option removed */}
                            </RadioGroup>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
             {students.length > 0 && !isLoadingStudents && !isLoadingAttendance && (
                 <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting || isLoadingStudents || isLoadingAttendance} className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Saving..." : "Save Attendance"}
                    </Button>
                 </div>
             )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

