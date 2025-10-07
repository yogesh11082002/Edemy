

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/lib/types';
import { Trash2, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, getDoc, writeBatch, increment, getDocs, query, where } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!firestore) return;
      setIsLoading(true);
      const storedCart = localStorage.getItem('edemy-cart');
      if (storedCart) {
        const itemIds = JSON.parse(storedCart) as string[];
        const items: Course[] = [];
        const coursesCollection = collection(firestore, 'courses');

        for (const id of itemIds) {
          try {
            const docRef = doc(coursesCollection, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              items.push({ id: docSnap.id, ...docSnap.data() } as Course);
            }
          } catch (error) {
            console.error(`Error fetching course ${id}:`, error);
          }
        }
        setCartItems(items);
      }
      setIsLoading(false);
    };

    fetchCartItems();
  }, [firestore]);


  const handleRemove = (id: string) => {
    const newCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newCartItems);
    const itemIds = newCartItems.map((item) => item.id);
    localStorage.setItem('edemy-cart', JSON.stringify(itemIds));
    toast({
      title: 'Item removed',
      description: 'The course has been removed from your cart.',
    });
  };

  const handleCheckout = async () => {
     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to checkout.',
      });
      return;
    }
    if (!firestore) return;

    setIsCheckingOut(true);
    
    const batch = writeBatch(firestore);
    const enrollmentData: Record<string, any> = {};

    const userEnrolledCoursesRef = collection(firestore, 'users', user.uid, 'enrolledCourses');
    const userEnrolledCoursesSnap = await getDocs(userEnrolledCoursesRef);
    const currentlyEnrolledIds = userEnrolledCoursesSnap.docs.map(doc => doc.id);

    let itemsToEnroll = 0;

    cartItems.forEach(item => {
      if (currentlyEnrolledIds.includes(item.id)) {
        toast({
          variant: 'default',
          title: 'Already Enrolled',
          description: `You are already enrolled in "${item.title}".`,
        });
        return; // Skip this item
      }

      itemsToEnroll++;

      // 1. Update the student count on the course document
      const courseRef = doc(firestore, 'courses', item.id);
      batch.update(courseRef, {
        enrolledStudents: increment(1)
      });
      
      // 2. Create a new document in the user's enrolledCourses subcollection
      const enrolledCourseRef = doc(firestore, 'users', user.uid, 'enrolledCourses', item.id);
      const enrolledCourseData = {
        courseId: item.id,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false
      };
      batch.set(enrolledCourseRef, enrolledCourseData);
      enrollmentData[enrolledCourseRef.path] = enrolledCourseData;
    });

    if (itemsToEnroll === 0) {
      setCartItems([]);
      localStorage.removeItem('edemy-cart');
      setIsCheckingOut(false);
      return;
    }

    batch.commit()
      .then(() => {
          toast({
              title: 'Checkout Successful!',
              description: 'Your new courses are available in your dashboard.',
          });
          setCartItems([]);
          localStorage.removeItem('edemy-cart');
      })
      .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
              // Even though it's a batch, we can provide context for one of the operations
              path: `users/${user.uid}/enrolledCourses`, 
              operation: 'write',
              requestResourceData: enrollmentData
          });
          errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
          setIsCheckingOut(false);
      });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
             <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">
                Shopping Cart
                </h1>
            </header>
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Loading Cart...</h2>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Shopping Cart
        </h1>
      </header>
      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">
              {cartItems.length} Course{cartItems.length > 1 ? 's' : ''} in
              Cart
            </h2>
            <div className="space-y-6">
              {cartItems.map((course) => (
                <Card key={course.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
                  <div className="relative h-32 w-full sm:w-40 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                      data-ai-hint={course.imageHint}
                    />
                  </div>
                  <div className="flex-grow w-full">
                    <h3 className="font-bold font-headline text-lg">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      By {course.instructorName}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="font-bold text-amber-500">
                        {course.rating}
                      </span>
                      {/* <span>({course.reviewCount})</span> */}
                      <span className="text-muted-foreground">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full mt-4 sm:mt-0 sm:w-auto">
                    <span className="text-lg font-bold text-primary">
                      ${course.price}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(course.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                       <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-4">
                    <CardTitle className="text-xl font-headline">Payment Method</CardTitle>
                    <CardDescription>This is a demo. No real payment will be processed.</CardDescription>
                     <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <Input id="card-number" placeholder="**** **** **** 1234" disabled />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" disabled />
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary-accent text-primary-foreground"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Complete Purchase'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/courses">Keep Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
