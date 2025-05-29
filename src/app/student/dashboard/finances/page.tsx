import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import Image from "next/image";

export default function StudentFinancesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Financial Overview</h2>
        <p className="text-muted-foreground">
          Track your fees, payments, and any outstanding fines.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Fee Payment History
          </CardTitle>
          <CardDescription>
            Manage your hostel fee payments and view transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
          <Image src="https://placehold.co/600x300.png" alt="Finance Details Placeholder" width={600} height={300} data-ai-hint="invoice payment" className="rounded-lg opacity-70" />
          <p className="mt-6 text-lg text-muted-foreground">Financial details and payment portal are under development.</p>
          <p className="text-sm text-muted-foreground">Soon you'll be able to view invoices and make payments here.</p>
        </CardContent>
      </Card>
    </div>
  );
}