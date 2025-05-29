
import { AppLogo } from "@/components/layout/AppLogo";
import { UserNav } from "@/components/layout/UserNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserDetails, getSingleStudentMonthlyAttendance } from "@/actions/user";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Wifi, Utensils, BookOpen, ShieldCheck, Dumbbell, Tv2, WashingMachine, UserSquare2, CalendarCheck2, Receipt } from "lucide-react";
// Removed unused icons: Mail, Phone, UsersRound, Fingerprint, MapPin, CalendarDays

// Facility Items (copied from home page for now)
const facilities = [
  { name: "High-Speed Wi-Fi", description: "Seamless internet access throughout the hostel.", icon: Wifi },
  { name: "Laundry Service", description: "Convenient and hygienic laundry facilities.", icon: WashingMachine },
  { name: "Study Room", description: "Quiet and well-lit space for focused learning.", icon: BookOpen },
  { name: "24/7 Security", description: "Ensuring a safe and secure environment for all residents.", icon: ShieldCheck },
  { name: "Gymnasium", description: "Equipped with modern fitness machines.", icon: Dumbbell },
  { name: "Common Room", description: "A place to relax, socialize, and unwind.", icon: Tv2 },
];

// Mess Timings (copied from home page for now)
const messTimings = [
  { meal: "Breakfast", time: "8:00 AM – 9:00 AM", icon: Utensils },
  { meal: "Lunch", time: "1:00 PM – 2:00 PM", icon: Utensils },
  { meal: "Dinner", time: "7:00 PM – 8:00 PM", icon: Utensils },
];

const BILLING_RATE_PER_DAY = 80;

interface UserDashboardPageProps {
  params: {
    userId: string;
  };
}

export default async function UserDashboardPage({ params }: UserDashboardPageProps) {
  const user = await getUserDetails(params.userId);
  const attendanceData = await getSingleStudentMonthlyAttendance(params.userId);

  if (!user) {
    notFound();
  }
  
  const studentDetails = {
    fullName: user.fullName || "N/A",
    email: user.email || "N/A",
    phone: user.phone || "N/A",
    parentPhone: user.parentPhone || "N/A",
    aadhaar: user.aadhaar || "N/A",
    gender: user.gender || "N/A",
    dob: user.dob ? format(new Date(user.dob), "PPP") : "N/A",
    address: user.address || "N/A",
  };

  let attendancePercentage = 0;
  let presentDays = 0;
  let totalDaysInMonth = 0;
  let billAmount = 0;

  if (attendanceData) {
    presentDays = attendanceData.presentDays;
    totalDaysInMonth = attendanceData.totalDaysInMonth;
    if (totalDaysInMonth > 0) {
      attendancePercentage = (presentDays / totalDaysInMonth) * 100;
    }
    billAmount = presentDays * BILLING_RATE_PER_DAY;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <AppLogo />
          <UserNav userName={studentDetails.fullName} userEmail={studentDetails.email} />
        </div>
      </header>

      <main className="container mx-auto flex-1 p-4 py-8 md:p-6 lg:p-8 max-w-screen-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Welcome, {studentDetails.fullName.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mb-8">
          Here&apos;s an overview of your hostel information and services.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Student Details Card */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserSquare2 className="h-6 w-6 text-primary" />
                My Profile Details
              </CardTitle>
              <CardDescription>Your personal and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 text-sm">
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Full Name:</strong>
                  <p className="text-foreground">{studentDetails.fullName}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Email:</strong>
                  <p className="text-foreground">{studentDetails.email}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Phone Number:</strong>
                  <p className="text-foreground">{studentDetails.phone}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Parent&apos;s Phone:</strong>
                  <p className="text-foreground">{studentDetails.parentPhone}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Aadhaar Number:</strong>
                  <p className="text-foreground">{studentDetails.aadhaar}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Gender:</strong>
                  <p className="text-foreground capitalize">{studentDetails.gender}</p>
                </div>
                <div>
                  <strong className="font-medium text-muted-foreground block mb-1">Date of Birth:</strong>
                  <p className="text-foreground">{studentDetails.dob}</p>
                </div>
                <div className="sm:col-span-2">
                  <strong className="font-medium text-muted-foreground block mb-1">Address:</strong>
                  <p className="text-foreground whitespace-pre-line">{studentDetails.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mess Timings Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-primary" />
                    Mess Timings
                </CardTitle>
                <CardDescription>Daily meal schedule.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {messTimings.map((timing) => (
                  <div key={timing.meal} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <timing.icon className="h-5 w-5 text-primary mr-3" />
                      <span className="font-medium text-card-foreground">{timing.meal}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{timing.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attendance and Bill Section */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 lg:mt-8">
          {/* Attendance Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck2 className="h-6 w-6 text-primary" />
                My Attendance (Current Month)
              </CardTitle>
              <CardDescription>Your attendance summary for {format(new Date(), "MMMM yyyy")}.</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceData ? (
                <div className="space-y-3">
                  <Progress value={attendancePercentage} aria-label={`${attendancePercentage.toFixed(1)}% attendance`} className="h-3" />
                  <p className="text-center text-lg font-semibold text-foreground">
                    {attendancePercentage.toFixed(1)}%
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {presentDays} / {totalDaysInMonth} days present
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Attendance data not available for this month.</p>
              )}
            </CardContent>
          </Card>

          {/* Bill Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-6 w-6 text-primary" />
                My Bill (Current Month)
              </CardTitle>
              <CardDescription>Calculated bill for {format(new Date(), "MMMM yyyy")}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {attendanceData ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Present Days:</span>
                    <span className="font-semibold text-foreground">{presentDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate per Day:</span>
                    <span className="font-semibold text-foreground">₹{BILLING_RATE_PER_DAY.toFixed(2)}</span>
                  </div>
                  <hr className="border-border my-2" />
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-foreground">Calculated Bill:</span>
                    <span className="text-primary">₹{billAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">Billing information cannot be calculated.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Facilities Section */}
        <section id="facilities" className="py-12 mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Hostel Facilities</h2>
              <p className="mt-1 text-muted-foreground">Amenities available for your convenience.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              {facilities.map((facility) => (
                <Card key={facility.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                     <facility.icon className="h-8 w-8 text-primary mb-2" />
                     <CardTitle className="text-xl">{facility.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{facility.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground max-w-screen-2xl">
          <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
