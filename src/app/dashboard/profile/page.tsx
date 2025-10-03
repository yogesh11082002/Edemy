
'use client';

import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { courses } from '@/lib/placeholder-data';
import { EnrolledCourseCard } from '@/components/dashboard/student/enrolled-course-card';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user) {
        setDisplayName(user.displayName || '');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
        try {
            await updateProfile(user, { displayName });
            toast({
                title: "Profile Updated",
                description: "Your display name has been updated.",
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: "Update Failed",
                description: error.message,
            });
        }
    }
  }

  if (isUserLoading || !user) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  const enrolledCourses = courses.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="profile">Profile Overview</TabsTrigger>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                 <Card>
                    <CardHeader>
                    <div className='flex items-center gap-6'>
                        <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl">{user.displayName}</CardTitle>
                            <CardDescription className="text-lg">{user.email}</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Welcome to your profile. Here you can manage your courses and account settings.
                    </p>
                    <Button onClick={handleSignOut} variant="destructive">
                        Sign Out
                    </Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="courses">
                <Card>
                    <CardHeader>
                        <CardTitle>My Enrolled Courses</CardTitle>
                        <CardDescription>Continue your learning journey.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                            <EnrolledCourseCard key={course.id} course={course} progress={Math.floor(Math.random() * 80) + 10} />
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="settings">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Full Name</Label>
                                <Input 
                                    id="displayName" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user.email || ''} disabled />
                                <p className='text-sm text-muted-foreground'>Email cannot be changed.</p>
                            </div>
                            <Button type="submit">Update Profile</Button>
                        </form>

                        <div className="space-y-4 p-4 border border-destructive/50 rounded-lg">
                            <h3 className="font-semibold text-destructive">Danger Zone</h3>
                             <p className='text-sm text-muted-foreground'>
                                Deleting your account is a permanent action and cannot be undone.
                            </p>
                            <Button variant="destructive">Delete My Account</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
