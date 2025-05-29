
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, ListChecks, DollarSign, UserCheck, UserX, CheckCircle, XCircle, BedDouble } from "lucide-react";
import { getTotalStudentsCount, getAllStudentsForDashboard } from "@/actions/admin";

export default async function AdminDashboardPage() {
  const totalStudents = await getTotalStudentsCount();
  // Fetch a limited number of students for the dashboard previews
  const studentsListForDashboard = await getAllStudentsForDashboard(5); 

  // Mock data generation for attendance and payment based on fetched students for dashboard preview
  const attendanceData = studentsListForDashboard.map(student => ({
    ...student,
    status: Math.random() > 0.6 ? "Present" : "Absent", // 60% present
  }));

  const paymentData = studentsListForDashboard.map(student => ({
    ...student,
    status: Math.random() > 0.7 ? "Paid" : "Unpaid", // 70% paid
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of hostel operations and student management.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          IconComponent={Users} 
          description="Registered users" 
          href="/admin/dashboard/students" // Added href to make it clickable
        />
        <StatCard title="Total Rooms" value="120" IconComponent={BedDouble} description="Mocked: +5 since last month" />
        <StatCard title="Attendance Today" value="92%" IconComponent={ListChecks} description="Mocked: 216 present" />
        <StatCard title="Fees Due (This Month)" value="$4,250" IconComponent={DollarSign} description="Mocked data" />
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Monthly Attendance Table Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Recent Student Attendance
            </CardTitle>
            <CardDescription>Snapshot of recent student attendance (mock data).</CardDescription>
          </CardHeader>
          <CardContent>
            {studentsListForDashboard.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={student.status === "Present" ? "default" : "destructive"} className="min-w-[90px] justify-center">
                          {student.status === "Present" ?
                            <UserCheck className="mr-1 h-3.5 w-3.5" /> :
                            <UserX className="mr-1 h-3.5 w-3.5" />
                          }
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No student data to display attendance.</p>
            )}
          </CardContent>
        </Card>

        {/* Bill Payment Status Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Recent Bill Payments
            </CardTitle>
            <CardDescription>Snapshot of recent student bill payments (mock data).</CardDescription>
          </CardHeader>
          <CardContent>
             {studentsListForDashboard.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentData.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={student.status === "Paid" ? "default" : "destructive"} className="min-w-[80px] justify-center">
                           {student.status === "Paid" ?
                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> :
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                          }
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No student data to display payment status.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
