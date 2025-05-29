import { Building2 } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Hostel Management System Home">
      <Building2 className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">Hostel Management System</h1>
    </Link>
  );
}
