import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CourseCard } from '@/components/courses/course-card';
import { courses, testimonials } from '@/lib/placeholder-data';
import { ArrowRight, BookOpen, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featuredCourses = courses.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
                Unlock Your Potential with LearnVerse
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Explore thousands of courses on programming, design, business, and more. Start learning today and advance your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-gradient-primary-accent text-primary-foreground hover:opacity-90 transition-opacity">
                  <Link href="/courses">
                    Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard/instructor">Become an Instructor</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="https://picsum.photos/seed/hero/600/400"
                alt="Happy students learning"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover w-full h-full"
                data-ai-hint="happy students"
              />
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="featured-courses" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Featured Courses</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked courses by our experts to help you get started on your learning journey.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        
        {/* Why LearnVerse Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose LearnVerse?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide a world-class learning experience with benefits that matter.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold font-headline">Expert-Led Courses</h3>
                <p className="text-muted-foreground">Learn from industry professionals who are passionate about teaching.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold font-headline">Vibrant Community</h3>
                <p className="text-muted-foreground">Connect with a community of learners and instructors.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
                <Star className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold font-headline">Flexible Learning</h3>
                <p className="text-muted-foreground">Learn at your own pace, anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Students Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from our students about their learning experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-card border-none shadow-lg transform hover:scale-105 transition-transform duration-300">
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
                        <h3 className="font-bold">{testimonial.name}</h3>
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
        <section className="py-16 md:py-24 bg-gradient-primary-accent">
          <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Start Learning?</h2>
            <p className="text-lg mt-4 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and take the next step in your career.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary hover:bg-secondary/90">
              <Link href="/courses">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
