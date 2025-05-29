
import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavItem } from '@/components/dashboard/DashboardLayout';

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", iconName: "LayoutDashboard", matchExact: true },
  { href: "/admin/dashboard/billing", label: "Billing", iconName: "CreditCard" },
  { href: "/admin/dashboard/attendance", label: "Attendance Overview", iconName: "ListChecks" },
  { href: "/admin/dashboard/attendance/mark", label: "Mark Attendance", iconName: "ListPlus" },
  { href: "/admin/dashboard/students", label: "Students", iconName: "Users" },
  { href: "/admin/dashboard/complaints", label: "Complaints", iconName: "MessageSquareWarning" },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout navItems={adminNavItems} userRole="Admin">
      {children}
    </DashboardLayout>
  );
}

