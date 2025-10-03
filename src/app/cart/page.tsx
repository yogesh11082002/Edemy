'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { courses as allCourses } from '@/lib/placeholder-data';
import { Course } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('edemy-cart');
    if (storedCart) {
      const itemIds = JSON.parse(storedCart) as string[];
      const items = allCourses.filter((course) => itemIds.includes(course.id));
      setCartItems(items);
    }
  }, []);


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

  const handleCheckout = () => {
    toast({
      title: 'Checkout Successful!',
      description:
        'Thank you for your purchase. Your courses are now available in your dashboard.',
    });
    setCartItems([]);
    localStorage.removeItem('edemy-cart');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (!isClient) {
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
                      By {course.instructor.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="font-bold text-amber-500">
                        {course.rating}
                      </span>
                      <span>({course.reviewCount})</span>
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
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taxes calculated at checkout.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary-accent text-primary-foreground"
                  onClick={handleCheckout}
                >
                  Checkout
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
