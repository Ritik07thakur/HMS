
"use client";
import type { ReactNode } from 'react';
import { AppLogo } from '@/components/layout/AppLogo';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setIsClient(true); // Indicate that the component has mounted on the client
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {children}
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        {isClient && currentYear ? `© ${currentYear} Hostel Management System. All rights reserved.` : `© Hostel Management System. All rights reserved.`}
      </p>
    </div>
  );
}

