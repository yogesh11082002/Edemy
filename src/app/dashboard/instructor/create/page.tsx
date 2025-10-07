import { CreateCourseForm } from "@/components/dashboard/instructor/create-course-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateCoursePage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Create a New Course</CardTitle>
                    <CardDescription>Fill out the details below. Use our AI assistant to help you generate engaging content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateCourseForm />
                </CardContent>
            </Card>
        </div>
    )
}