
"use client";

import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../shared/theme-toggle';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAdmin } from '@/hooks/use-admin';
import { Searchbar } from './search-bar';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Header() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAdmin();

  const handleSignOut = () => {
    auth?.signOut();
    router.push('/');
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <Suspense fallback={<Skeleton className="h-10 w-64 hidden md:block" />}>
                <Searchbar />
            </Suspense>
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            {isUserLoading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
                <Button asChild className="bg-gradient-primary-accent text-primary-foreground shadow-md"><Link href="/signup">Sign Up</Link></Button>
              </>
            )}
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  A list of navigation links and user actions for mobile view.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
                <Logo />
                <nav className="grid gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-4">
                  {user ? (
                     <Button onClick={() => { handleSignOut(); setOpen(false); }} size="lg">Sign Out</Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="lg" asChild><Link href="/login" onClick={() => setOpen(false)}>Log In</Link></Button>
                      <Button size="lg" asChild className="bg-gradient-primary-accent text-primary-foreground shadow-md"><Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
