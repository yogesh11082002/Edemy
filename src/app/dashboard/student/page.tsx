
'use client';

import { EnrolledCourseCard } from '@/components/dashboard/student/enrolled-course-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Course, EnrolledCourse } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Award } from 'lucide-react';

type EnrolledCourseWithDetails = EnrolledCourse & {
  details?: Course;
};

export default function StudentDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const enrolledCoursesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'enrolledCourses');
  }, [firestore, user]);

  const { data: enrolledCourseIds, isLoading: loadingIds } = useCollection<EnrolledCourse>(enrolledCoursesQuery);

  useEffect(() => {
    if (!loadingIds && enrolledCourseIds && firestore) {
      const fetchCourseDetails = async () => {
        setIsLoading(true);
        const coursesWithDetails: EnrolledCourseWithDetails[] = [];
        for (const enrolled of enrolledCourseIds) {
          const courseRef = doc(firestore, 'courses', enrolled.courseId);
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            coursesWithDetails.push({
              ...enrolled,
              details: { id: courseSnap.id, ...courseSnap.data() } as Course,
            });
          }
        }
        setEnrolledCourses(coursesWithDetails);
        setIsLoading(false);
      };
      fetchCourseDetails();
    } else if (!loadingIds && !enrolledCourseIds) {
       setIsLoading(false);
    }
  }, [enrolledCourseIds, loadingIds, firestore]);

   const handleRatingSubmit = async (courseId: string, rating: number) => {
    if (!firestore || !user) return;
    
    const courseRef = doc(firestore, 'courses', courseId);
    const enrollmentRef = doc(firestore, 'users', user.uid, 'enrolledCourses', courseId);

    try {
        const courseSnap = await getDoc(courseRef);
        if (!courseSnap.exists()) throw new Error("Course not found");
        
        const courseData = courseSnap.data() as Course;
        const currentRating = courseData.rating || 0;
        const reviewCount = courseData.reviewCount || 0;

        const newReviewCount = reviewCount + 1;
        const newTotalRating = currentRating * reviewCount + rating;
        const newAverageRating = newTotalRating / newReviewCount;
        
        const batch = writeBatch(firestore);
        
        batch.update(courseRef, {
            rating: newAverageRating,
            reviewCount: newReviewCount
        });

        batch.update(enrollmentRef, {
            rated: rating
        });
        
        await batch.commit();

        // Optimistically update UI
        setEnrolledCourses(prev => prev.map(c => c.courseId === courseId ? {...c, rated: rating} : c));

    } catch (error) {
        console.error("Failed to submit rating", error);
    }
};

  const completedCourses = enrolledCourses.filter(c => c.progress === 100);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            My Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrolledCourse) => (
                enrolledCourse.details ? (
                  <EnrolledCourseCard
                    key={enrolledCourse.courseId}
                    course={enrolledCourse.details}
                    progress={enrolledCourse.progress}
                    rated={enrolledCourse.rated}
                    onRatingSubmit={handleRatingSubmit}
                  />
                ) : null
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">You have not enrolled in any courses yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(course => (
                  <div key={course.courseId} className="flex flex-col items-center justify-center p-6 text-center bg-secondary rounded-lg border-2 border-dashed">
                      <Award className="h-12 w-12 text-amber-500 mb-4" />
                      <h3 className="font-semibold">{course.details?.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Congratulations on completing the course! Your certificate will be issued soon.</p>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have not earned any certificates yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
