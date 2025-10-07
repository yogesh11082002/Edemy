
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, PlusCircle, Star, Users, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteCourseDialog } from '@/components/dashboard/instructor/delete-course-dialog';
import { useToast } from '@/hooks/use-toast';

export default function InstructorDashboardPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const coursesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'courses'), where('instructorId', '==', user.uid));
    }, [firestore, user]);
    
    const { data: instructorCourses, isLoading: coursesLoading, setData: setInstructorCourses } = useCollection<Course>(coursesQuery);

    const stats = useMemo(() => {
        if (!instructorCourses) {
            return {
                totalRevenue: 0,
                totalStudents: 0,
                averageRating: 0,
            };
        }

        const totalStudents = instructorCourses.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0);
        const totalRating = instructorCourses.reduce((acc, course) => acc + (course.rating || 0), 0);
        const averageRating = instructorCourses.length > 0 ? totalRating / instructorCourses.length : 0;
        
        // Revenue calculation is a placeholder
        const totalRevenue = instructorCourses.reduce((acc, course) => acc + (course.price * (course.enrolledStudents || 0) * 0.7), 0);


        return {
            totalRevenue,
            totalStudents,
            averageRating
        }

    }, [instructorCourses]);

    const handleDeleteCourse = async () => {
        if (!courseToDelete || !firestore) return;
        
        try {
            const courseRef = doc(firestore, 'courses', courseToDelete.id);
            await deleteDoc(courseRef);
            
            // Optimistically update the UI
            setInstructorCourses(prevCourses => prevCourses?.filter(c => c.id !== courseToDelete.id) || null);

            toast({
                title: 'Course Deleted',
                description: `"${courseToDelete.title}" has been successfully deleted.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete course. Please try again.',
            });
        } finally {
            setCourseToDelete(null);
        }
    };


    if (isUserLoading || !user) {
        return <div className="text-center py-12">Loading instructor dashboard...</div>;
    }
    
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
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
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead className="hidden xl:table-cell">
                  Students
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursesLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading courses...</TableCell>
                </TableRow>
              )}
              {instructorCourses && instructorCourses.map((course) => (
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
                   <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">Published</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    ${course.price}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {course.enrolledStudents?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/instructor/edit/${course.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/instructor/analytics/${course.id}`}>View Analytics</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setCourseToDelete(course)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteCourseDialog 
        course={courseToDelete}
        onConfirm={handleDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
}
