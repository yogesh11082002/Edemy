import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { courses } from '@/lib/placeholder-data';
import { DollarSign, PlusCircle, Star, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function InstructorDashboardPage() {
    const instructorCourses = courses.slice(0, 4);
    
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Course</CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/dashboard/instructor/create">Create New Course</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Courses</CardTitle>
          <CardDescription>Manage your courses and see their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Students
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructorCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={course.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={course.imageUrl}
                      width="64"
                      data-ai-hint={course.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Published</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${course.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.enrolledStudents?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                     <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
