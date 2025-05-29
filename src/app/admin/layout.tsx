
import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavItem } from '@/components/dashboard/DashboardLayout';
// Direct lucide-react icon imports are no longer needed here for navItems

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", iconName: "LayoutDashboard", matchExact: true },
  { href: "/admin/dashboard/rooms", label: "Room Allocation", iconName: "BedDouble" },
  { href: "/admin/dashboard/attendance", label: "Attendance", iconName: "ListChecks" },
  { href: "/admin/dashboard/students", label: "Students", iconName: "Users" },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={adminNavItems} userRole="Admin">
      {children}
    </DashboardLayout>
  );
}
