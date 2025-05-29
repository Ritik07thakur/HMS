import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, CreditCard, CircleUser, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  // Mock data
  const studentDetails = {
    name: "Alex Johnson",
    studentId: "S2024001",
    roomNo: "B-203",
    email: "alex.johnson@example.com",
    program: "Computer Science",
    year: "3rd Year",
  };

  const attendance = {
    overallPercentage: 92,
    last7DaysPercentage: 100,
    absencesThisMonth: 1,
  };

  const finances = {
    monthlyFee: 500,
    fines: 25,
    paidAmount: 400,
    dueDate: "July 5, 2024",
  };
  const totalDue = finances.monthlyFee + finances.fines - finances.paidAmount;


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {studentDetails.name.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your hostel information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Attendance Card */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Attendance Record
            </CardTitle>
            <CardDescription>Your attendance summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Attendance</span>
                <span className="font-semibold">{attendance.overallPercentage}%</span>
              </div>
              <Progress value={attendance.overallPercentage} aria-label={`${attendance.overallPercentage}% overall attendance`} />
            </div>
             <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Last 7 Days</span>
                <span className="font-semibold">{attendance.last7DaysPercentage}%</span>
              </div>
              <Progress value={attendance.last7DaysPercentage} aria-label={`${attendance.last7DaysPercentage}% attendance in last 7 days`} className="[&>*]:bg-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Absences this month: <span className="font-semibold text-foreground">{attendance.absencesThisMonth}</span>
            </p>
          </CardContent>
        </Card>

        {/* Financial Summary Card */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Financial Summary
            </CardTitle>
             <CardDescription>Overview of your fees and payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Fee:</span>
              <span className="font-semibold text-foreground">${finances.monthlyFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Outstanding Fines:</span>
              <span className="font-semibold text-red-600">${finances.fines.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold text-green-600">${finances.paidAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total Due:</span>
              <span className="text-primary">${totalDue.toFixed(2)}</span>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-2">
              Due by: {finances.dueDate}
            </p>
            {totalDue > 0 && (
                 <Badge variant="destructive" className="w-full flex items-center justify-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Payment Overdue
                 </Badge>
            )}
          </CardContent>
        </Card>
        
        {/* Student Details Card */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CircleUser className="h-5 w-5 text-primary" />
                My Details
            </CardTitle>
            <CardDescription>Your personal and academic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span className="text-foreground">{studentDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Student ID:</span>
              <span className="text-foreground">{studentDetails.studentId}</span>
            </div>
             <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Room No:</span>
              <span className="text-foreground">{studentDetails.roomNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span className="text-foreground">{studentDetails.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Program:</span>
              <span className="text-foreground">{studentDetails.program}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Year:</span>
              <span className="text-foreground">{studentDetails.year}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
