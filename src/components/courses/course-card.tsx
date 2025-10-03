"use client";

import type { Course } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from './star-rating';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
      <Link href={`/courses/${course.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              data-ai-hint={course.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
          <CardTitle className="text-lg font-bold font-headline leading-snug mb-2 flex-grow">
            {course.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-2">
            By {course.instructor.name}
          </p>
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="font-bold text-amber-500">{course.rating.toFixed(1)}</span>
            <StarRating rating={course.rating} />
            <span className="text-muted-foreground">({course.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="text-xl font-bold text-primary">${course.price}</span>
            <Button variant="ghost" asChild>
                <div onClick={(e) => { e.preventDefault(); console.log('Add to cart'); }} className="text-primary">View Details</div>
            </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
