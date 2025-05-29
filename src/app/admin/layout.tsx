import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavItem } from '@/components/dashboard/DashboardLayout';
import { LayoutDashboard, BedDouble, ListChecks, Users } from 'lucide-react';

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, matchExact: true },
  { href: "/admin/dashboard/rooms", label: "Room Allocation", icon: BedDouble },
  { href: "/admin/dashboard/attendance", label: "Attendance", icon: ListChecks },
  { href: "/admin/dashboard/students", label: "Students", icon: Users },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={adminNavItems} userRole="Admin">
      {children}
    </DashboardLayout>
  );
}
