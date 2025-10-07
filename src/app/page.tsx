
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CourseCard } from '@/components/courses/course-card';
import { testimonials } from '@/lib/placeholder-data';
import { ArrowRight, BookOpen, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Course } from '@/lib/types';

export default function Home() {
  const firestore = useFirestore();
  const coursesCollection = useMemoFirebase(() => collection(firestore, 'courses'), [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection<Course>(coursesCollection);
  
  const featuredCourses = courses ? courses.slice(0, 4) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Unlock Your Potential with Edemy
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Explore thousands of courses on programming, design, business, and more. Start learning today and advance your career.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button asChild size="lg" className="bg-gradient-primary-accent text-primary-foreground shadow-lg">
                  <Link href="/courses">
                    Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="shadow-sm">
                  <Link href="/dashboard/instructor">Become an Instructor</Link>
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="relative h-80 md:h-[450px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80"
                alt="Happy students learning"
                fill
                priority
                className="rounded-2xl shadow-2xl object-cover"
                data-ai-hint="happy students learning"
              />
            </motion.div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="featured-courses" className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Courses</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked courses by our experts to help you get started on your learning journey.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="text-center mt-12">
               <Button asChild variant="outline" size="lg">
                  <Link href="/courses">View All Courses</Link>
                </Button>
            </div>
          </div>
        </section>
        
        {/* Why Edemy Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Edemy?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide a world-class learning experience with benefits that matter.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div 
                className="flex flex-col items-center space-y-4 p-8 bg-card rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Expert-Led Courses</h3>
                <p className="text-muted-foreground">Learn from industry professionals who are passionate about teaching.</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-4 p-8 bg-card rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Vibrant Community</h3>
                <p className="text-muted-foreground">Connect with a community of learners and instructors.</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-4 p-8 bg-card rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                    <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Flexible Learning</h3>
                <p className="text-muted-foreground">Learn at your own pace, anytime, anywhere.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">What Our Students Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from our students about their learning experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-card border-none shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                        data-ai-hint="person avatar"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center text-foreground">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
            <p className="text-lg mt-4 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and take the next step in your career.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-lg">
              <Link href="/courses">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
