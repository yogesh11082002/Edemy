import { Logo } from '@/components/shared/logo';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Empowering minds through accessible online education.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LearnVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
