
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, CreditCard, CircleUser, AlertTriangle, Receipt } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
  // Mock data - This would be fetched dynamically in a real application
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
    currentMonthPercentage: 88, // Attendance for the current month
    absencesThisMonth: 3,
  };

  const finances = {
    baseMonthlyFee: 350.00, // Example: room rent, utilities
    messBillCurrentMonth: 150.00, // Specific mess bill for the current month
    fines: 25.00,
    paidAmount: 400.00,
    dueDate: "August 10, 2024",
  };

  const totalMonthlyCharges = finances.baseMonthlyFee + finances.messBillCurrentMonth;
  const totalDue = totalMonthlyCharges + finances.fines - finances.paidAmount;


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {studentDetails.name.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your hostel information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Monthly Attendance Summary Card */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Monthly Attendance Summary
            </CardTitle>
            <CardDescription>Your attendance for the current month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Current Month&apos;s Attendance</span>
                <span className="font-semibold">{attendance.currentMonthPercentage}%</span>
              </div>
              <Progress value={attendance.currentMonthPercentage} aria-label={`${attendance.currentMonthPercentage}% current month attendance`} />
            </div>
             <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Attendance</span>
                <span className="font-semibold">{attendance.overallPercentage}%</span>
              </div>
              <Progress value={attendance.overallPercentage} aria-label={`${attendance.overallPercentage}% overall attendance`} className="[&>*]:bg-sky-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Absences this month: <span className="font-semibold text-foreground">{attendance.absencesThisMonth}</span>
            </p>
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/student/dashboard/attendance">View Detailed Attendance</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Fee & Mess Bill Summary Card */}
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> {/* Changed icon to Receipt */}
                Fee & Mess Bill Summary
            </CardTitle>
             <CardDescription>Overview of your fees and payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Monthly Fee:</span>
              <span className="font-semibold text-foreground">${finances.baseMonthlyFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mess Bill (Current Month):</span>
              <span className="font-semibold text-foreground">${finances.messBillCurrentMonth.toFixed(2)}</span>
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
             <p className="text-xs text-muted-foreground text-center pt-1">
              Due by: {finances.dueDate}
            </p>
            {totalDue > 0 && (
                 <Badge variant="destructive" className="w-full flex items-center justify-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" /> 
                    {finances.paidAmount < totalMonthlyCharges + finances.fines ? "Payment Due" : "Payment Overdue"}
                 </Badge>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/student/dashboard/finances">View Payment History</Link>
            </Button>
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
              <span className="text-foreground truncate max-w-[180px]">{studentDetails.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Program:</span>
              <span className="text-foreground">{studentDetails.program}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Year:</span>
              <span className="text-foreground">{studentDetails.year}</span>
            </div>
             <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/student/dashboard/profile">View Full Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
