
import { getAllStudentsForDashboard, type StudentBasicInfo } from "@/actions/admin";
import { Users } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminAllStudentsPage() {
  const allStudents = await getAllStudentsForDashboard(); // No limit, fetches all

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">All Registered Students</h2>
        <p className="text-muted-foreground">
          A complete list of all students registered in the system.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Student List
            </div>
          </CardTitle>
          <CardDescription>
            Displaying all {allStudents.length} student(s).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allStudents.length > 0 ? (
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
                  {allStudents.map((student) => (
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
              <p className="text-lg font-semibold text-foreground mb-1">No Students Found</p>
              <p className="text-muted-foreground text-sm">
                There are currently no students registered in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
