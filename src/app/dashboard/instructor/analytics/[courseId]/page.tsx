
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Star, Users } from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, Tooltip, Area, Legend } from 'recharts';

const chartData = [
  { month: 'Jan', revenue: 4000, enrollments: 24 },
  { month: 'Feb', revenue: 3000, enrollments: 18 },
  { month: 'Mar', revenue: 5000, enrollments: 45 },
  { month: 'Apr', revenue: 4500, enrollments: 30 },
  { month: 'May', revenue: 6000, enrollments: 55 },
  { month: 'Jun', revenue: 7500, enrollments: 60 },
];

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
                        <div className="text-2xl font-bold">{(course.rating || 0).toFixed(1)} / 5.0</div>
                        <p className="text-xs text-muted-foreground">From {course.reviewCount} reviews</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Revenue and enrollment trends over the past 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Revenue ($)" />
                            <Area type="monotone" dataKey="enrollments" stackId="2" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" name="Enrollments" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
