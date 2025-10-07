
"use client";

import type { Course } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from './star-rating';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const instructorName = course.instructor ? course.instructor.name : course.instructorName || 'N/A';
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="flex flex-col overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
        <Link href={`/courses/${course.id}`} className="flex flex-col h-full group">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={course.imageHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col">
            <Badge variant="outline" className="w-fit mb-2">{course.category}</Badge>
            <CardTitle className="text-lg font-semibold leading-snug mb-2 flex-grow group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-4">
              By {instructorName}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-amber-500">{(course.rating || 0).toFixed(1)}</span>
              <StarRating rating={course.rating || 0} />
              <span className="text-muted-foreground">({course.reviewCount || 0})</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="text-xl font-bold text-primary">${course.price}</span>
              <div className="text-primary flex items-center">
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
