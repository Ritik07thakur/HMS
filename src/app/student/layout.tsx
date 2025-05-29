import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavItem } from '@/components/dashboard/DashboardLayout';
import { LayoutDashboard, CalendarCheck, CreditCard, CircleUser } from 'lucide-react';

const studentNavItems: NavItem[] = [
  { href: "/student/dashboard", label: "Overview", icon: LayoutDashboard, matchExact: true },
  { href: "/student/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/student/dashboard/finances", label: "Finances", icon: CreditCard },
  { href: "/student/dashboard/profile", label: "My Profile", icon: CircleUser },
];

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={studentNavItems} userRole="Student">
      {children}
    </DashboardLayout>
  );
}
