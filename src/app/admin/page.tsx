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
  const [isLoading, setIsLoading] = useState(false);
  
  // This state tracks if a login attempt has been made
  const [loginAttempted, setLoginAttempted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'yogeshthakur9536@gmail.com',
      password: 'Learn@458',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Authentication service is not available.',
      });
      setIsLoading(false);
      return;
    }

    if (values.email !== 'yogeshthakur9536@gmail.com') {
        toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'This email is not authorized for admin access.',
        });
        setIsLoading(false);
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setLoginAttempted(true); // Mark that a login was attempted to trigger re-evaluation
      toast({
        title: 'Login Successful',
        description: 'Verifying admin privileges...',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleClaimAdmin = async () => {
    if (user) {
        setIsLoading(true);
        try {
            await claimAdminRole(user.uid);
            toast({
                title: "Role Claimed!",
                description: "Admin role has been successfully claimed. Refreshing...",
            });
            // Force a re-check of admin status by re-fetching user or re-evaluating useAdmin
            window.location.reload(); 
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: "Failed to Claim Role",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setLoginAttempted(false); // Reset login attempt state
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    }
  }
  
  if (isUserLoading || (loginAttempted && isAdminLoading)) {
      return <div className="container mx-auto py-12 text-center">Verifying credentials...</div>;
  }

  // If user is logged in AND is an admin, show the dashboard
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
  
  // If user is logged in but NOT an admin
  if (user && !isAdmin) {
       return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
                    <CardDescription>
                       You have successfully logged in, but you do not have permission to access this page. 
                       If you are the designated admin, please claim your role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                   <Button onClick={handleClaimAdmin} disabled={isLoading}>
                       {isLoading ? "Claiming..." : "Claim Admin Role"}
                   </Button>
                    <Button onClick={handleLogout} variant="outline">Log Out</Button>
                </CardContent>
            </Card>
       );
  }

  // Default view: Show the admin login form
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
