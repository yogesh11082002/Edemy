
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { EditCourseForm } from '@/components/dashboard/instructor/edit-course-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCoursePage() {
    const params = useParams<{ courseId: string }>();
    const firestore = useFirestore();

    const courseRef = useMemoFirebase(() => {
        if (!params.courseId) return null;
        return doc(firestore, 'courses', params.courseId as string);
    }, [firestore, params.courseId]);

    const { data: course, isLoading } = useDoc<Course>(courseRef);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Course</CardTitle>
                <CardDescription>
                    Update the details for your course below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}
                {course && <EditCourseForm course={course} />}
                {!isLoading && !course && <p>Course not found.</p>}
            </CardContent>
        </Card>
    );
}
