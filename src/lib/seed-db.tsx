
'use client';

import { courses as placeholderCourses } from '@/lib/placeholder-data';
import { useFirestore } from '@/firebase';
import { writeBatch, collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Database } from 'lucide-react';
import { Course } from './types';

export function SeedDatabase() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      setIsLoading(false);
      return;
    }

    const coursesCollection = collection(firestore, 'courses');
    const batch = writeBatch(firestore);

    placeholderCourses.forEach((course) => {
      // Omit instructor object, as it's not in the db schema
      const { instructor, ...courseData } = course;
      
      const courseToAdd: Omit<Course, 'id' | 'instructor' | 'lessons'> = {
        ...courseData,
        // Add instructor details as top-level fields
        instructorId: instructor.id,
        instructorName: instructor.name,
        instructorAvatar: instructor.avatar,
        // Add server timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Use the original course ID for the document ID
      const courseRef = doc(coursesCollection, course.id);
      batch.set(courseRef, courseToAdd);
    });

    try {
      await batch.commit();
      toast({
        title: 'Database Seeded!',
        description: `${placeholderCourses.length} courses have been added to Firestore.`,
      });
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      <Database className="mr-2 h-4 w-4" />
      {isLoading ? 'Seeding...' : 'Seed Courses to Firestore'}
    </Button>
  );
}
