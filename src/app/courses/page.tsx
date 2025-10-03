import { CourseCard } from "@/components/courses/course-card";
import { courses, categories, levels, languages } from "@/lib/placeholder-data";
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

export default function CoursesPage({ searchParams }: { searchParams?: { query?: string } }) {
  const searchQuery = searchParams?.query || '';
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Explore Our Courses
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect course to boost your skills and career.
        </p>
      </header>
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
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
                      <Checkbox id={level.toLowerCase()} />
                      <Label htmlFor={level.toLowerCase()}>{level}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-range">Price Range</Label>
                <Slider defaultValue={[50]} max={200} step={1} id="price-range" />
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
                      <Checkbox id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`}>{rating} & up</Label>
                    </div>
                  ))}
                </div>
              </div>
               <div className="space-y-2">
                <Label>Language</Label>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox id={lang.toLowerCase()} />
                      <Label htmlFor={lang.toLowerCase()}>{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-primary-accent text-primary-foreground">Apply Filters</Button>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">
          {searchQuery && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Showing results for "{searchQuery}"
              </h2>
              <p className="text-muted-foreground text-sm">{filteredCourses.length} courses found.</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p>No courses found for your search.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
