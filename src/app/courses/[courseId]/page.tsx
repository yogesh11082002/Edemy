"use client";

import { courses, reviews } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StarRating } from "@/components/courses/star-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  Film,
  Globe,
  Play,
  Star,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [showVideo, setShowVideo] = useState(false);
  const course = courses.find((c) => c.id === params.courseId);

  if (!course) {
    notFound();
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
            <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <StarRating rating={course.rating} />
                    <span>{course.rating} ({course.reviewCount} reviews)</span>
                </div>
                <span>{course.enrolledStudents?.toLocaleString()} students</span>
            </div>
             <div className="flex items-center gap-2 mt-2 text-sm">
                <span>Created by</span>
                <span className="font-semibold underline">{course.instructor.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 lg:gap-12">
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
                <Accordion type="single" collapsible className="w-full">
                  {course.lessons.map((lesson, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Film className="h-5 w-5 text-primary" />
                          <span>{lesson.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-10">
                        <div className="flex items-center justify-between">
                            <p>Video Content</p>
                            <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-lg">{course.instructor.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {course.instructor.rating} Rating</div>
                            <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.instructor.studentCount.toLocaleString()} Students</div>
                            <div className="flex items-center gap-1"><Video className="h-4 w-4" /> {course.instructor.courseCount} Courses</div>
                        </div>
                    </div>
                 </div>
                 <p className="text-muted-foreground">{course.instructor.bio}</p>
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
                      <AvatarImage src={review.student.avatar} alt={review.student.name}/>
                      <AvatarFallback>{review.student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{review.student.name}</h4>
                        <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                      </div>
                      <StarRating rating={review.rating} className="my-1"/>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 relative">
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
                    <div onClick={() => setShowVideo(true)} className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" className="h-16 w-16 rounded-full">
                            <Play className="h-8 w-8 text-primary" />
                        </Button>
                    </div>
                </div>
              <CardContent className="p-6 space-y-4">
                <span className="text-3xl font-bold text-primary">${course.price}</span>
                <div className="flex gap-2">
                    <Button size="lg" className="w-full bg-gradient-primary-accent text-primary-foreground">Enroll Now</Button>
                    <Button size="lg" variant="outline" className="w-full">Add to Cart</Button>
                </div>
                <div className="space-y-3 text-sm pt-4">
                    <h4 className="font-semibold">This course includes:</h4>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> {course.duration} on-demand video</div>
                    <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground"/> Certificate of completion</div>
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> Taught in {course.language}</div>
                    <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground"/> {course.level} level</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                 <button onClick={() => setShowVideo(false)} className="absolute -top-10 right-0 text-white hover:text-primary transition-colors">
                     <X className="h-8 w-8" />
                 </button>
                <div className="aspect-video bg-black">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
