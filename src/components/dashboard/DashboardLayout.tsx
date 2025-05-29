
"use client"; 
// Top level layout for dashboards needs to be client for SidebarProvider context

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLogo } from '@/components/layout/AppLogo';
import { UserNav } from '@/components/layout/UserNav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  BedDouble,
  ListChecks,
  ListPlus, // Added ListPlus import
  Users,
  CalendarCheck,
  CreditCard,
  CircleUser,
  type LucideProps,
  type LucideIcon as LucideIconType // Renaming to avoid conflict if needed, clarifies it's a type
} from 'lucide-react';

// Define a map for icon names to components
const IconMap = {
  LayoutDashboard,
  BedDouble,
  ListChecks,
  ListPlus, // Added ListPlus to IconMap
  Users,
  CalendarCheck,
  CreditCard,
  CircleUser,
} as const; // Use 'as const' for precise key typing

// Update NavItem interface to use iconName
export interface NavItem {
  href: string;
  label: string;
  iconName: keyof typeof IconMap; // Use names from IconMap
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole: 'Admin' | 'Student';
}

function SidebarNavigation({ navItems }: { navItems: NavItem[]; userRole: string }) {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const IconComponent = IconMap[item.iconName];
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={item.matchExact ? pathname === item.href : pathname.startsWith(item.href)}
              tooltip={open ? undefined : item.label}
            >
              <Link href={item.href}>
                {IconComponent && <IconComponent />} {/* Render icon from map */}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export default function DashboardLayout({ children, navItems, userRole }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <ScrollArea className="h-full">
             <SidebarNavigation navItems={navItems} userRole={userRole} />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
           <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            © {new Date().getFullYear()} Hostel Management System
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:h-16 sm:px-6">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
            <h2 className="ml-2 text-lg font-semibold text-foreground hidden md:block">{userRole} Dashboard</h2>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

