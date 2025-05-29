
import { getStudentAttendanceForCurrentMonth, type StudentMonthlyAttendance, type DailyAttendanceStatus } from "@/actions/admin";
import { ListChecks } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function getStatusVariant(status: DailyAttendanceStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'P': return "default";
    case 'A': return "destructive";
    case '-': return "outline";
    default: return "outline";
  }
}

function getStatusTooltip(status: DailyAttendanceStatus): string {
  switch (status) {
    case 'P': return "Present";
    case 'A': return "Absent";
    case '-': return "No Record / Holiday";
    default: return "Status Unknown";
  }
}

export default async function AdminAttendancePage() {
  const attendanceData: StudentMonthlyAttendance[] = await getStudentAttendanceForCurrentMonth();
  const currentMonthName = format(new Date(), "MMMM yyyy");
  const daysInMonth = attendanceData.length > 0 ? attendanceData[0].totalDaysInMonth : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Attendance Management</h2>
        <p className="text-muted-foreground">
          Track and manage student attendance records for {currentMonthName}.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Monthly Attendance Overview
            </div>
          </CardTitle>
          <CardDescription>
            Daily attendance status for all students for {currentMonthName}.
            Displaying {attendanceData.length} student(s).
            <br />
            <small className="text-xs text-muted-foreground">P: Present, A: Absent, -: No Record/Holiday</small>
            <br />
            <small className="text-xs text-muted-foreground">Note: Use the 'Mark Attendance' section to record daily attendance.</small>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-card z-10 min-w-[150px]">Student Name</TableHead>
                    {dayHeaders.map(day => (
                      <TableHead key={day} className="text-center min-w-[40px] px-1">{day}</TableHead>
                    ))}
                    <TableHead className="text-center min-w-[120px]">Total Present</TableHead>
                    <TableHead className="text-center min-w-[150px]">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((student) => {
                    const attendancePercentage = student.totalDaysInMonth > 0 ? (student.presentDays / student.totalDaysInMonth) * 100 : 0;
                    return (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium sticky left-0 bg-card z-10">{student.fullName}</TableCell>
                        {student.dailyStatuses.map((status, index) => (
                          <TableCell key={index} className="text-center px-1 py-2">
                            <Badge
                              variant={getStatusVariant(status)}
                              className="h-6 w-6 flex items-center justify-center p-0 text-xs"
                              title={getStatusTooltip(status)}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">{student.presentDays} / {student.totalDaysInMonth}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm mb-1">{attendancePercentage.toFixed(1)}%</span>
                            <Progress value={attendancePercentage} className="h-2 w-24" aria-label={`${attendancePercentage.toFixed(1)}% attendance`} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-8 text-center">
              <ListChecks className="h-16 w-16 text-muted-foreground mb-6" />
              <p className="text-xl font-semibold text-foreground mb-2">No Student Data Found</p>
              <p className="text-muted-foreground">
                Either no students are registered, or attendance data could not be fetched.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
