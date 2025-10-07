
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
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user) {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
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
                description: "Your profile has been successfully updated.",
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

  return (
    <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                 <Card>
                    <CardHeader>
                    <div className='flex flex-col md:flex-row items-center gap-6'>
                        <Avatar className="h-24 w-24">
                        <AvatarImage src={photoURL || user.photoURL || ''} alt={displayName || ''} />
                        <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl text-center md:text-left">{displayName}</CardTitle>
                            <CardDescription className="text-lg text-center md:text-left">{user.email}</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Welcome to your profile. Here you can manage your account settings.
                    </p>
                    <Button onClick={handleSignOut} variant="destructive">
                        Sign Out
                    </Button>
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
