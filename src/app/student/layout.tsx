
import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavItem } from '@/components/dashboard/DashboardLayout';
// Direct lucide-react icon imports are no longer needed here for navItems

const studentNavItems: NavItem[] = [
  { href: "/student/dashboard", label: "Overview", iconName: "LayoutDashboard", matchExact: true },
  { href: "/student/dashboard/attendance", label: "Attendance", iconName: "CalendarCheck" },
  { href: "/student/dashboard/finances", label: "Finances", iconName: "CreditCard" },
  { href: "/student/dashboard/profile", label: "My Profile", iconName: "CircleUser" },
];

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={studentNavItems} userRole="Student">
      {children}
    </DashboardLayout>
  );
}
