'use client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
