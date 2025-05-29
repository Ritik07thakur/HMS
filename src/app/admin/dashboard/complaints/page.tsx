
import { getAllComplaints, type PopulatedComplaint } from "@/actions/admin";
import { MessageSquareWarning, Search } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";


function getStatusVariant(status: PopulatedComplaint['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Pending': return "outline";
    case 'In Progress': return "secondary";
    case 'Resolved': return "default";
    default: return "outline";
  }
}

// Client Component for handling search and display
function ComplaintsClientView({ initialComplaints }: { initialComplaints: PopulatedComplaint[] }) {
  "use client";
  const [searchTerm, setSearchTerm] = React.useState(""); // Explicitly use React.useState

  const complaintsToDisplay = React.useMemo(() => { // Explicitly use React.useMemo
    if (!searchTerm) {
      return initialComplaints;
    }
    return initialComplaints.filter(complaint =>
      (complaint.student?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (complaint.student?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (complaint.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (complaint.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialComplaints]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5 text-primary" />
            All Complaints ({complaintsToDisplay.length})
          </div>
        </CardTitle>
        <CardDescription>
          List of all submitted complaints. Displaying {complaintsToDisplay.length} of {initialComplaints.length}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search complaints by student, category, or description..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        </div>
        {complaintsToDisplay.length > 0 ? (
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
                {complaintsToDisplay.map((complaint) => (
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
              <p className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? "No Complaints Match Your Search" : "No Complaints Found"}
              </p>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term." : "There are currently no complaints submitted by students."}
              </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}


export default async function AdminComplaintsPage() {
  const complaints: PopulatedComplaint[] = await getAllComplaints();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Student Complaints</h2>
        <p className="text-muted-foreground">
          Review and manage complaints submitted by students. Use the search bar to filter complaints.
        </p>
      </div>
      <ComplaintsClientView initialComplaints={complaints} />
    </div>
  );
}
