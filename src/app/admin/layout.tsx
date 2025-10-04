'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return <div className="container mx-auto py-12 text-center">Checking admin privileges...</div>;
  }

  if (!isAdmin) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome, Admin. Manage your platform here.</p>
      </div>
      {children}
    </div>
  );
}
