
'use client';

import { reviews } from '@/lib/placeholder-data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { StarRating } from '@/components/courses/star-rating';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  Clock,
  Globe,
  Play,
  Star,
  User,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Course, EnrolledCourse, Lesson } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [showVideo, setShowVideo] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const { user } = useUser();

  const firestore = useFirestore();
  const courseRef = useMemoFirebase(() => doc(firestore, 'courses', params.courseId as string), [firestore, params.courseId]);
  const { data: course, isLoading: courseLoading } = useDoc<Course>(courseRef);

  const enrollmentRef = useMemoFirebase(() => {
    if (user && params.courseId) {
      return doc(collection(firestore, 'users', user.uid, 'enrolledCourses'), params.courseId as string);
    }
    return null;
  }, [firestore, user, params.courseId]);

  const { data: enrollment, isLoading: enrollmentLoading } = useDoc<EnrolledCourse>(enrollmentRef);
  const isEnrolled = !!enrollment;

  useEffect(() => {
    // Set the initial video to the first lesson of the first section if available
    if (course?.curriculum?.[0]?.lessons?.[0]?.videoUrl) {
      const firstVideoUrl = getEmbedUrl(course.curriculum[0].lessons[0].videoUrl);
      if (firstVideoUrl) {
        setActiveVideoUrl(firstVideoUrl);
      }
    }
  }, [course]);

  const handleAddToCart = () => {
    if (!course) return;
    const storedCart = localStorage.getItem('edemy-cart');
    let cartIds = storedCart ? JSON.parse(storedCart) : [];
    if (!cartIds.includes(course.id)) {
      cartIds.push(course.id);
      localStorage.setItem('edemy-cart', JSON.stringify(cartIds));
    }
    router.push('/cart');
  };

  const handleEnrollNow = () => {
    handleAddToCart();
  };

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.hostname === 'youtu.be'
          ? urlObj.pathname.slice(1).split('?')[0]
          : urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.slice(1).split('/')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
    } catch (e) {
      console.error('Invalid video URL', e);
      return null;
    }
    // Fallback for other direct video links
    return url;
  };

  const handlePlayClick = async (lesson: Lesson) => {
    const embedUrl = getEmbedUrl(lesson.videoUrl);
    if (embedUrl) {
      setActiveVideoUrl(embedUrl);
      setShowVideo(true);

      // Track progress if enrolled and the lesson hasn't been watched yet
      if (isEnrolled && enrollmentRef && enrollment && !enrollment.watchedLessons?.includes(lesson.title)) {
        const totalLessons = course?.curriculum?.reduce((acc, section) => acc + section.lessons.length, 0) || 1;
        const newWatchedLessons = [...(enrollment.watchedLessons || []), lesson.title];
        const newProgress = Math.round((newWatchedLessons.length / totalLessons) * 100);

        await updateDoc(enrollmentRef, {
          watchedLessons: arrayUnion(lesson.title),
          progress: newProgress,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Video URL',
        description: 'The provided URL is not a valid video link.',
      });
    }
  };
  

  if (courseLoading || enrollmentLoading || !course) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        Loading...
      </div>
    );
  }

  const courseReviews = reviews.slice(0, 2);

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">
              {course.title}
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/80">
              {course.summary}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <StarRating rating={course.rating} />
                <span>
                  {course.rating} ({course.reviewCount} reviews)
                </span>
              </div>
              <span>{course.enrolledStudents?.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span>Created by</span>
              <Link href="#" className="font-semibold underline">
                {course.instructorName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 lg:gap-12">
          {/* Sidebar (moved up for mobile) */}
          <aside className="lg:hidden mb-8">
             <Card className="sticky top-24">
              <div className="relative group">
                <Image
                  src={course.imageUrl}
                  alt={`Preview for ${course.title}`}
                  width={600}
                  height={338}
                  className="rounded-t-lg object-cover w-full aspect-video"
                  data-ai-hint={course.imageHint}
                />
                 <div
                  onClick={() => handlePlayClick(course.curriculum?.[0]?.lessons?.[0] || { title: '', videoUrl: '' })}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-16 w-16 rounded-full"
                  >
                    <Play className="h-8 w-8 text-primary" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                { isEnrolled ? (
                  <>
                     <Button size="lg" className="w-full" asChild>
                      <Link href="/dashboard/student">Go to Dashboard</Link>
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">You are enrolled in this course.</p>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ${course.price}
                    </span>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-primary-accent text-primary-foreground"
                        onClick={handleEnrollNow}
                      >
                        Enroll Now
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </>
                )}
                <div className="space-y-3 text-sm pt-4">
                  <h4 className="font-semibold">This course includes:</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />{' '}
                    {course.duration} on-demand video
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />{' '}
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Taught in{' '}
                    {course.language}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />{' '}
                    {course.level} level
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.curriculum && course.curriculum.length > 0 ? (
                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {course.curriculum.map((section, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="font-bold text-lg">{section.title}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-4">
                                        {section.lessons.map((lesson, lessonIndex) => (
                                            <li key={lessonIndex} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                                                <div className="flex items-center gap-3">
                                                    <Video className="h-5 w-5 text-muted-foreground" />
                                                    <span>{lesson.title}</span>
                                                </div>
                                                 {(isEnrolled || index === 0) && (
                                                    <Button variant="ghost" size="sm" onClick={() => handlePlayClick(lesson)}>
                                                        {isEnrolled ? 'Play' : 'Preview'}
                                                    </Button>
                                                 )}
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-muted-foreground">Curriculum not available yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={course.instructorAvatar}
                      alt={course.instructorName || ''}
                    />
                    <AvatarFallback>
                      {course.instructorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">
                      {course.instructorName}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Student Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courseReviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.student.avatar}
                        alt={review.student.name}
                      />
                      <AvatarFallback>
                        {review.student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{review.student.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {review.createdAt}
                        </span>
                      </div>
                      <StarRating rating={review.rating} className="my-1" />
                      <p className="text-muted-foreground text-sm">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (desktop) */}
          <aside className="lg:col-span-1 relative hidden lg:block">
            <Card className="sticky top-24">
              <div className="relative group">
                <Image
                  src={course.imageUrl}
                  alt={`Preview for ${course.title}`}
                  width={600}
                  height={338}
                  className="rounded-t-lg object-cover w-full aspect-video"
                  data-ai-hint={course.imageHint}
                />
                 <div
                  onClick={() => handlePlayClick(course.curriculum?.[0]?.lessons?.[0] || { title: '', videoUrl: '' })}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-16 w-16 rounded-full"
                  >
                    <Play className="h-8 w-8 text-primary" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                 { isEnrolled ? (
                   <>
                     <Button size="lg" className="w-full" asChild>
                      <Link href="/dashboard/student">Go to Dashboard</Link>
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">You are enrolled in this course.</p>
                   </>
                 ) : (
                   <>
                      <span className="text-3xl font-bold text-primary">
                        ${course.price}
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="lg"
                          className="w-full bg-gradient-primary-accent text-primary-foreground"
                          onClick={handleEnrollNow}
                        >
                          Enroll Now
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full"
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </Button>
                      </div>
                   </>
                 )}
                <div className="space-y-3 text-sm pt-4">
                  <h4 className="font-semibold">This course includes:</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />{' '}
                    {course.duration} on-demand video
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />{' '}
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Taught in{' '}
                    {course.language}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />{' '}
                    {course.level} level
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
       {showVideo && activeVideoUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={activeVideoUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
