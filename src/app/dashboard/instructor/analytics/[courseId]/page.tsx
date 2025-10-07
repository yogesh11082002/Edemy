
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CourseAnalyticsPage() {
    const params = useParams<{ courseId: string }>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
                <CardDescription>
                    Showing analytics for course with ID: {params.courseId}. This is a placeholder page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Implement your course analytics dashboard here.</p>
            </CardContent>
        </Card>
    );
}
