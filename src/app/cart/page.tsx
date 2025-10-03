"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { courses } from "@/lib/placeholder-data";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState(courses.slice(0, 2));

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Shopping Cart
        </h1>
      </header>
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">{cartItems.length} Courses in Cart</h2>
            <div className="space-y-6">
              {cartItems.map(course => (
                <Card key={course.id} className="flex items-start gap-4 p-4">
                  <div className="relative h-24 w-40 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                      data-ai-hint={course.imageHint}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold font-headline text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">By {course.instructor.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="font-bold text-amber-500">{course.rating}</span>
                      <span>({course.reviewCount})</span>
                      <span className="text-muted-foreground">{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-primary">${course.price}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(course.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taxes and shipping calculated at checkout.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full bg-gradient-primary-accent text-primary-foreground">
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
