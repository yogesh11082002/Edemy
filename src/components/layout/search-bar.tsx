
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    // If the user navigates back/forward, update the search input
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`/courses?query=${query}`);
    } else {
      router.push('/courses');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search courses..."
        className="pl-10 w-64"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
