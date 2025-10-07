
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Star, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const chartData = [
  { month: 'Jan', enrollments: 65 },
  { month: 'Feb', enrollments: 59 },
  { month: 'Mar', enrollments: 80 },
  { month: 'Apr', enrollments: 81 },
  { month: 'May', enrollments: 56 },
  { month: 'Jun', enrollments: 70 },
];

const recentStudents = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', joined: '2 days ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80' },
    { id: '2', name: 'Bob Williams', email: 'bob@example.com', joined: '3 days ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', joined: '1 week ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&q=80' },
]

export default function CourseAnalyticsPage() {
    const params = useParams<{ courseId: string }>();
    const firestore = useFirestore();

    const courseRef = useMemoFirebase(() => {
        if (!params.courseId) return null;
        return doc(firestore, 'courses', params.courseId as string);
    }, [firestore, params.courseId]);

    const { data: course, isLoading } = useDoc<Course>(courseRef);

    const estimatedRevenue = (course?.price || 0) * (course?.enrolledStudents || 0);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!course) {
        return <p>Course not found.</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{course.title}</h1>
                <p className="text-muted-foreground">Analytics Overview</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${estimatedRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Based on current enrollments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{course.enrolledStudents?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total students enrolled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{course.rating.toFixed(1)} / 5.0</div>
                        <p className="text-xs text-muted-foreground">From {course.reviewCount} reviews</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Enrollment Trend</CardTitle>
                    <CardDescription>Student enrollments over the past 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Students</CardTitle>
                    <CardDescription>A list of the most recent student enrollments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="text-right">Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={student.avatar} alt={student.name} />
                                                <AvatarFallback>{student.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                                    <TableCell className="text-right">{student.joined}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
