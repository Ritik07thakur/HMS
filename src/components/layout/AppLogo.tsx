import { Building2 } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="DormNexus Home">
      <Building2 className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">DormNexus</h1>
    </Link>
  );
}
