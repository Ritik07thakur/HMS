import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CircleUser } from "lucide-react";
import Image from "next/image";

export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h2>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleUser className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Keep your contact details and other personal data up-to-date.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
          <Image src="https://placehold.co/600x300.png" alt="Profile Management Placeholder" width={600} height={300} data-ai-hint="user profile form" className="rounded-lg opacity-70" />
          <p className="mt-6 text-lg text-muted-foreground">Profile editing features are coming soon.</p>
           <p className="text-sm text-muted-foreground">You will be able to update your details here shortly.</p>
        </CardContent>
      </Card>
    </div>
  );
}