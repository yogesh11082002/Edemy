
'use client';
import { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/courses/star-rating';
import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type EnrolledCourseCardProps = {
  course: Course;
  progress: number;
  rated?: number;
  onRatingSubmit: (courseId: string, rating: number) => void;
};

export function EnrolledCourseCard({ course, progress, rated, onRatingSubmit }: EnrolledCourseCardProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onRatingSubmit(course.id, selectedRating);
      setIsDialogOpen(false);
    }
  };


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
          By {course.instructorName}
        </p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">{progress}% complete</p>
      </CardContent>
      <div className="p-4 pt-0">
        {progress < 100 ? (
          <Button asChild className="w-full bg-gradient-primary-accent text-primary-foreground">
            <Link href={`/courses/${course.id}`}>Continue Learning</Link>
          </Button>
        ) : rated ? (
           <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">You rated:</p>
            <StarRating rating={rated} />
           </div>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Rate Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate {course.title}</DialogTitle>
                <DialogDescription>
                  Your feedback helps other students.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-4" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-8 w-8 cursor-pointer text-amber-500"
                    fill={(hoverRating >= star || selectedRating >= star) ? 'currentColor' : 'none'}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
              </div>
              <Button onClick={handleSubmit} disabled={selectedRating === 0}>Submit Rating</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}
