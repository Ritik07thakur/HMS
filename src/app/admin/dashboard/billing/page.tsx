
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStudentAttendanceForCurrentMonth, type StudentMonthlyAttendance } from "@/actions/admin";
import { CreditCard } from "lucide-react";
import { format } from 'date-fns';

const BILLING_RATE_PER_DAY = 80; // Rupees per present day

export default async function AdminBillingPage() {
  const attendanceData: StudentMonthlyAttendance[] = await getStudentAttendanceForCurrentMonth();
  const currentMonthName = format(new Date(), "MMMM yyyy");

  const billingData = attendanceData.map(student => ({
    ...student,
    billAmount: student.presentDays * BILLING_RATE_PER_DAY,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Student Billing Management</h2>
        <p className="text-muted-foreground">
          Overview of student bills for {currentMonthName} based on attendance.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Monthly Billing Overview
          </CardTitle>
          <CardDescription>
            Calculated bills for {currentMonthName}. Billing rate: ₹{BILLING_RATE_PER_DAY} per present day.
            <br />
            <small className="text-xs text-muted-foreground">Note: This calculation is based on the recorded attendance for the current month.</small>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Student Name</TableHead>
                    <TableHead className="text-center min-w-[180px]">Total Present Days (This Month)</TableHead>
                    <TableHead className="text-right min-w-[150px]">Calculated Bill (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingData.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell className="text-center">{student.presentDays} / {student.totalDaysInMonth}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{student.billAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-8 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground mb-6" />
              <p className="text-xl font-semibold text-foreground mb-2">No Student Data Found</p>
              <p className="text-muted-foreground">Could not calculate bills. Ensure students are registered and attendance is recorded.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
