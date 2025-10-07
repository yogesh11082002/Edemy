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
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { BarChart, BookOpen, DollarSign, Users, Activity } from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, Tooltip, Area } from 'recharts';
import { collection } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const chartData = [
  { date: 'Jan', users: 120, revenue: 1500 },
  { date: 'Feb', users: 180, revenue: 2200 },
  { date: 'Mar', users: 250, revenue: 3100 },
  { date: 'Apr', users: 210, revenue: 2800 },
  { date: 'May', users: 320, revenue: 4000 },
  { date: 'Jun', users: 380, revenue: 4500 },
];

export default function AdminPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const firestore = useFirestore();
  const coursesCollection = useMemoFirebase(() => collection(firestore, 'courses'), [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection<Course>(coursesCollection);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('isAdminLoggedIn');
    if (adminStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

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
      await signInWithEmailAndPassword(auth, values.email, values.password);
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
      });
      router.refresh(); // Refresh to re-evaluate layout state
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

  if (isUserLoading) {
      return <div className="text-center py-16">Initializing...</div>;
  }
  
  if (isAuthenticated) {
    const totalCourses = courses?.length || 0;
    
    return (
      <>
        <AdminHeader title="Admin Dashboard" description="An overview of your platform's performance." />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {coursesLoading ? 'Loading...' : 'Total courses on platform'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                Currently on the platform
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>User and revenue growth over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
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
