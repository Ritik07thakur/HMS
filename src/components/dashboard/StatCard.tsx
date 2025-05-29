
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  IconComponent: LucideIcon;
  iconBgColor?: string;
  href?: string; // Added href prop
}

export function StatCard({ title, value, description, IconComponent, iconBgColor = "bg-primary/10", href }: StatCardProps) {
  const cardContent = (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${iconBgColor}`}>
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
