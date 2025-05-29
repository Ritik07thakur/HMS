import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

export default function AdminStudentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Student Management</h2>
        <p className="text-muted-foreground">
          Manage student profiles, records, and details.
        </p>
      </div>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student Database
          </CardTitle>
          <CardDescription>
            Access and manage all student information in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
          <Image src="https://placehold.co/600x300.png" alt="Student Management Placeholder" width={600} height={300} data-ai-hint="database user profiles" className="rounded-lg opacity-70" />
          <p className="mt-6 text-lg text-muted-foreground">Student management module is under construction.</p>
          <p className="text-sm text-muted-foreground">Features for viewing, editing, and adding student profiles are coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}