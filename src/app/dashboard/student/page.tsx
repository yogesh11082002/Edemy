import { EnrolledCourseCard } from '@/components/dashboard/student/enrolled-course-card';
import { courses } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboardPage() {
  const enrolledCourses = courses.slice(0, 3);
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            My Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} progress={Math.floor(Math.random() * 80) + 10} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have not earned any certificates yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
