'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { BarChart, BookOpen, Users } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const ADMIN_EMAIL = 'yogeshthakur9536@gmail.com';

export default function AdminPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'yogeshthakur9536@gmail.com',
      password: 'Learn@458',
    },
  });

  useEffect(() => {
    // If a user is already logged in and is the admin, show the dashboard
    if (user && user.email === ADMIN_EMAIL) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, isUserLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.email !== ADMIN_EMAIL) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'This email is not authorized for admin access.',
      });
      return;
    }

    setIsLoggingIn(true);
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Authentication service is not available.',
      });
      setIsLoggingIn(false);
      return;
    }

    try {
      // Sign in the user
      await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // On successful login, the useEffect will trigger and set isAuthenticated to true.
      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
      });
      // The state change will automatically render the dashboard.

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  }
  
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setIsAuthenticated(false);
      form.reset(); // Clear form on logout
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out from the admin panel.',
      });
    }
  }
  
  // While hooks are loading initial user status
  if (isUserLoading) {
      return <div className="text-center py-16">Initializing...</div>;
  }
  
  // If the user is authenticated as admin, show the dashboard
  if (isAuthenticated) {
    return (
       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Management</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Course Management</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Total courses available</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$12,345</div>
                <p className="text-xs text-muted-foreground">Total revenue this month</p>
            </CardContent>
        </Card>
        <div className="col-span-full">
            <Button onClick={handleLogout} variant="destructive">Log Out</Button>
        </div>
      </div>
    );
  }

  // If no admin is logged in, show the admin login form
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
