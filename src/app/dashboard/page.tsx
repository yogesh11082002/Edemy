'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
        router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return <div className="text-center py-12">Loading dashboard...</div>;
    }

  return (
    <div>
      <p className="text-lg text-muted-foreground mb-8">Welcome back, {user.displayName || 'Learner'}! Choose your path.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Student Dashboard</CardTitle>
                <CardDescription>View your enrolled courses and track your progress.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/student">
                Go to Student Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Instructor Dashboard</CardTitle>
                <CardDescription>Manage your courses, view earnings, and interact with students.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/instructor">
                Go to Instructor Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
