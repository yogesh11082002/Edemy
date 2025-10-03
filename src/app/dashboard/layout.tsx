export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-headline font-bold mb-8">
        Dashboard
      </h1>
      {children}
    </div>
  );
}
