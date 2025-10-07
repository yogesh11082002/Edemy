
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditCoursePage() {
    const params = useParams<{ courseId: string }>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Course</CardTitle>
                <CardDescription>
                    You are now editing course with ID: {params.courseId}. This is a placeholder page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Implement your course editing form here.</p>
            </CardContent>
        </Card>
    );
}
