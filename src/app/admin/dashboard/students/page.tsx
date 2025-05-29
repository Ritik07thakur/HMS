
import { getAllStudentsForDashboard, type StudentBasicInfo } from "@/actions/admin";
import { Users, Search } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Client Component to handle search and display
function StudentsClientView({ initialStudents }: { initialStudents: StudentBasicInfo[] }) {
  "use client";
  const [searchTerm, setSearchTerm] = React.useState(""); // Explicitly use React.useState
  const [filteredStudents, setFilteredStudents] = React.useState<StudentBasicInfo[]>(initialStudents); // Explicitly use React.useState

  React.useEffect(() => { // Explicitly use React.useEffect
    setFilteredStudents(initialStudents);
  }, [initialStudents]);

  const studentsToDisplay = React.useMemo(() => { // Explicitly use React.useMemo
    if (!searchTerm) {
      return initialStudents;
    }
    return initialStudents.filter(student =>
      (student.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.parentPhone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialStudents]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student List
          </div>
        </CardTitle>
        <CardDescription>
          Displaying {studentsToDisplay.length} of {initialStudents.length} student(s).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students by name, email, phone, or address..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        </div>
        {studentsToDisplay.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="min-w-[130px]">Parent's Phone</TableHead>
                  <TableHead className="min-w-[200px]">Address</TableHead>
                  <TableHead className="min-w-[150px]">Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsToDisplay.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.parentPhone || 'N/A'}</TableCell>
                    <TableCell className="whitespace-pre-line">{student.address || 'N/A'}</TableCell>
                    <TableCell>
                      {student.createdAt ? format(new Date(student.createdAt), "PPP, p") : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="min-h-[200px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">
              {searchTerm ? "No Students Match Your Search" : "No Students Found"}
            </p>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Try a different search term." : "There are currently no students registered in the system."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminAllStudentsPage() {
  const allStudents = await getAllStudentsForDashboard(); // No limit, fetches all

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">All Registered Students</h2>
        <p className="text-muted-foreground">
          A complete list of all students registered in the system. Use the search bar to filter students.
        </p>
      </div>
      <StudentsClientView initialStudents={allStudents} />
    </div>
  );
}
