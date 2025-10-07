'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Database,
  Home,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';

const navItems = [
  { href: '/admin', label: 'Overview', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/seed', label: 'Seed Data', icon: Database },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    
    useEffect(() => {
        // Check session storage for admin login status
        const adminStatus = sessionStorage.getItem('isAdminLoggedIn');
        setIsAdminLoggedIn(adminStatus === 'true');
        
        if (adminStatus !== 'true' && pathname !== '/admin') {
            router.push('/admin');
        }

    }, [pathname, router]);

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
            sessionStorage.removeItem('isAdminLoggedIn');
            router.push('/');
        }
    }
    
    if (isUserLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // This handles the case where the layout is active but the user isn't logged in yet on the main admin page
    if (!isAdminLoggedIn && pathname === '/admin') {
         return <div className="bg-muted min-h-screen">{children}</div>;
    }
    
    // For any other admin page, if user is not there, we don't render children to avoid content flash
    if (!isAdminLoggedIn) {
        return null; 
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('');
    }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo />
                  <span className="sr-only">Edemy</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                       pathname === item.href && "bg-muted text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             {/* Can add a search bar here if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'}/>
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Settings</Link>
                </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
