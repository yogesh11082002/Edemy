
import { Suspense } from 'react';
import { CoursesView } from '@/components/courses/courses-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Explore Our Courses
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect course to boost your skills and career.
        </p>
      </header>
      <CoursesView />
    </div>
  );
}


function CoursesPageSkeleton() {
    return (
        <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <Skeleton className="h-[700px] w-full" />
            </aside>
            <main className="md:col-span-3">
                <div className="mb-4">
                    <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="mb-4">
                    <Skeleton className="h-5 w-1/6" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[192px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
