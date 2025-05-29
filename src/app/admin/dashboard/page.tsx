import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Users, ListChecks, DollarSign } from "lucide-react";
import Image from 'next/image';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Overview</h2>
        <p className="text-muted-foreground">
          Key metrics and insights for hostel management.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value="120" IconComponent={BedDouble} description="+5 since last month" />
        <StatCard title="Total Students" value="235" IconComponent={Users} description="Capacity: 240" />
        <StatCard title="Attendance Today" value="95%" IconComponent={ListChecks} description="223 students present" />
        <StatCard title="Fees Collected (Month)" value="$18,500" IconComponent={DollarSign} description="Target: $20,000" />
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-primary" />
              Room Allocation
            </CardTitle>
            <CardDescription>Overview of room occupancy and availability.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for room allocation data/chart */}
            <div className="flex items-center justify-center h-60 bg-muted/50 rounded-md">
               <Image src="https://placehold.co/400x200.png" alt="Room Allocation Placeholder" width={400} height={200} data-ai-hint="chart floorplan" className="rounded-md opacity-50"/>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Detailed room status and student assignments can be managed in the 'Room Allocation' section.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Attendance Statistics
            </CardTitle>
            <CardDescription>Summary of student attendance records.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for attendance statistics/chart */}
             <div className="flex items-center justify-center h-60 bg-muted/50 rounded-md">
               <Image src="https://placehold.co/400x200.png" alt="Attendance Chart Placeholder" width={400} height={200} data-ai-hint="graph attendance" className="rounded-md opacity-50"/>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Track daily attendance, view trends, and manage absentees in the 'Attendance' section.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
