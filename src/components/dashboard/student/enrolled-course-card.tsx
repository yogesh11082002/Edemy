import { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

type EnrolledCourseCardProps = {
  course: Course;
  progress: number;
};

export function EnrolledCourseCard({ course, progress }: EnrolledCourseCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-40 w-full">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          data-ai-hint={course.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-bold font-headline leading-snug">
          {course.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          By {course.instructor.name}
        </p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">{progress}% complete</p>
      </CardContent>
      <div className="p-4 pt-0">
        <Button asChild className="w-full bg-gradient-primary-accent text-primary-foreground">
          <Link href={`/courses/${course.id}`}>Continue Learning</Link>
        </Button>
      </div>
    </Card>
  );
}
