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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { claimAdminRole } from '@/lib/admin-actions';
import { BarChart, BookOpen, Users } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function AdminPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isClaimingRole, setIsClaimingRole] = useState(false);

  // This state tracks if a user is authenticated on this specific admin page session
  // It's separate from the global `user` state to manage the dedicated login flow
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'yogeshthakur9536@gmail.com',
      password: 'Learn@458',
    },
  });

  useEffect(() => {
    // If the global user is an admin, we can set the local auth state
    if (user && isAdmin) {
      setIsAdminAuthenticated(true);
    }
  }, [user, isAdmin]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      // First, try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // After successful sign-in, the useAdmin hook will re-evaluate.
      // We don't need to do anything here immediately, as the useEffect and component body
      // will handle the display change based on the updated `isAdmin` value.
      toast({
        title: 'Login Successful',
        description: 'Verifying admin privileges...',
      });
      // A small delay to allow hooks to update before hiding the form
      setTimeout(() => {
        // We let the main render logic decide what to show now.
        // We set isAdminAuthenticated to true if the login was successful.
        // The isAdmin check will then determine the final view.
        if (userCredential.user) {
          // This doesn't mean they are an admin yet, just that login worked.
          // The useAdmin hook will determine the final role.
        }
      }, 1000);

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

  const handleClaimAdmin = async () => {
    if (user) {
        setIsClaimingRole(true);
        try {
            await claimAdminRole(user.uid);
            toast({
                title: "Role Claimed!",
                description: "Admin role has been successfully claimed. You now have access.",
            });
            // Force a re-check of admin status by forcing a re-render or state update
             // This might not be instant, a page reload is the most reliable way
            window.location.reload();
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: "Failed to Claim Role",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsClaimingRole(false);
        }
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setIsAdminAuthenticated(false);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out from the admin panel.',
      });
    }
  }
  
  // While hooks are loading initial user and admin status
  if (isUserLoading || isAdminLoading) {
      return <div className="text-center py-16">Initializing...</div>;
  }
  
  // If the user is successfully authenticated and IS an admin, show the dashboard
  if (user && isAdmin) {
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
  
  // If a user is logged in, but is NOT an admin
  if (user && !isAdmin) {
       return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
                    <CardDescription>
                       You have successfully logged in as {user.email}, but you do not have permission to access the admin dashboard. 
                       If this is the designated admin account, please claim your role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                   <Button onClick={handleClaimAdmin} disabled={isClaimingRole}>
                       {isClaimingRole ? "Claiming..." : "Claim Admin Role"}
                   </Button>
                    <Button onClick={handleLogout} variant="outline">Log Out</Button>
                </CardContent>
            </Card>
       );
  }

  // If no user is logged in (or the logged-in user isn't admin), show the admin login form
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
