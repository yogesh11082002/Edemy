
"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CourseCard } from "@/components/courses/course-card";
import { categories, levels, languages } from "@/lib/placeholder-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

function Filters({ isMobile = false }: { isMobile?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [stagedPriceRange, setStagedPriceRange] = useState([200]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([200]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const firestore = useFirestore();
  const coursesCollection = useMemoFirebase(() => collection(firestore, 'courses'), [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection<Course>(coursesCollection);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  const handleLevelChange = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };
  
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRating(prev => prev === rating ? 0 : rating);
  }

  const applyPriceFilter = () => {
    setAppliedPriceRange(stagedPriceRange);
  }

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevels([]);
    setStagedPriceRange([200]);
    setAppliedPriceRange([200]);
    setSelectedRating(0);
    setSelectedLanguages([]);
  }

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter(course => {
      // Search query filter
      const matchesSearch = searchQuery ? (
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

      // Level filter
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);

      // Price filter
      const matchesPrice = course.price <= appliedPriceRange[0];

      // Rating filter
      const matchesRating = selectedRating === 0 || (course.rating || 0) >= selectedRating;

      // Language filter
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(course.language);

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesRating && matchesLanguage;
    });
  }, [searchQuery, selectedCategory, selectedLevels, appliedPriceRange, selectedRating, selectedLanguages, courses]);
  
  const filterContent = (
      <Card className={isMobile ? "border-0 shadow-none" : "sticky top-24"}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline text-2xl">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <div className="space-y-2">
                {levels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${level.toLowerCase()}${isMobile ? '-mobile' : ''}`}
                      checked={selectedLevels.includes(level)}
                      onCheckedChange={() => handleLevelChange(level)}
                    />
                    <Label htmlFor={`${level.toLowerCase()}${isMobile ? '-mobile' : ''}`}>{level}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-range">Price (up to ${stagedPriceRange[0]})</Label>
               <div className="flex items-center gap-2">
                <Slider value={stagedPriceRange} onValueChange={setStagedPriceRange} max={200} step={1} id="price-range" />
                <Button onClick={applyPriceFilter} size="sm">Go</Button>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$200</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`rating-${rating}${isMobile ? '-mobile' : ''}`}
                      checked={selectedRating === rating}
                      onCheckedChange={() => handleRatingChange(rating)}
                    />
                    <Label htmlFor={`rating-${rating}${isMobile ? '-mobile' : ''}`}>{rating} & up</Label>
                  </div>
                ))}
              </div>
            </div>
             <div className="space-y-2">
              <Label>Language</Label>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                     <Checkbox 
                      id={`${lang.toLowerCase()}${isMobile ? '-mobile' : ''}`}
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={() => handleLanguageChange(lang)}
                    />
                    <Label htmlFor={`${lang.toLowerCase()}${isMobile ? '-mobile' : ''}`}>{lang}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
  );

  return (
    <>
      <aside className={cn("md:col-span-1", { "hidden md:block": !isMobile, "md:hidden": isMobile })}>
        {filterContent}
      </aside>
      <main className="md:col-span-3">
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Showing results for "{searchQuery}"
            </h2>
          </div>
        )}
         <div className="mb-4 flex justify-between items-center">
            <p className="text-muted-foreground text-sm">{filteredCourses.length} courses found.</p>
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
                </SheetTrigger>
                <SheetContent>
                  <Filters isMobile />
                </SheetContent>
              </Sheet>
            )}
          </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesLoading ? (
            Array.from({length: 6}).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[192px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No courses match your criteria. Try adjusting your filters.</p>
          )}
        </div>
      </main>
    </>
  )
}

export function CoursesView() {
  return (
    <div className="grid md:grid-cols-4 gap-8">
      <Filters />
    </div>
  );
}
