import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import Image from "next/image";

export default function AdminRoomsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Room Allocation Management</h2>
        <p className="text-muted-foreground">
          View, assign, and manage hostel room allocations.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            Room Status Overview
          </CardTitle>
          <CardDescription>
            Interactive interface for managing room assignments and availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
          <Image src="https://placehold.co/600x300.png" alt="Room Management Placeholder" width={600} height={300} data-ai-hint="floorplan rooms" className="rounded-lg opacity-70" />
          <p className="mt-6 text-lg text-muted-foreground">Room allocation features are under development.</p>
          <p className="text-sm text-muted-foreground">Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}