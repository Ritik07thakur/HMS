
import { getAllComplaints, type PopulatedComplaint } from "@/actions/admin";
import { MessageSquareWarning } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function getStatusVariant(status: PopulatedComplaint['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Pending': return "outline";
    case 'In Progress': return "secondary";
    case 'Resolved': return "default";
    default: return "outline";
  }
}

export default async function AdminComplaintsPage() {
  const complaints: PopulatedComplaint[] = await getAllComplaints();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Student Complaints</h2>
        <p className="text-muted-foreground">
          Review and manage complaints submitted by students.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-primary" />
              All Complaints ({complaints.length})
            </div>
          </CardTitle>
          <CardDescription>
            List of all submitted complaints. Displaying all {complaints.length} complaints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {complaints.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Submitted By</TableHead>
                    <TableHead className="min-w-[180px]">Student Email</TableHead>
                    <TableHead className="min-w-[120px]">Category</TableHead>
                    <TableHead className="min-w-[250px] max-w-[400px]">Description</TableHead>
                    <TableHead className="text-center min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Submitted On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium">
                        {complaint.student?.fullName || 'N/A (User Deleted)'}
                      </TableCell>
                      <TableCell>
                        {complaint.student?.email || 'N/A'}
                      </TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell className="whitespace-pre-wrap text-xs leading-relaxed">
                        {complaint.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(complaint.status)} className="min-w-[90px] justify-center">
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(complaint.createdAt), "PPP, p")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-8 text-center">
                <MessageSquareWarning className="h-16 w-16 text-muted-foreground mb-6" />
                <p className="text-xl font-semibold text-foreground mb-2">No Complaints Found</p>
                <p className="text-muted-foreground">
                  There are currently no complaints submitted by students.
                </p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
