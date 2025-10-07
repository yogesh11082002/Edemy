

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCourseDescriptionAction } from "./actions";
import { useState, useTransition } from "react";
import { PlusCircle, Trash2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, levels } from "@/lib/placeholder-data";
import { useFirestore, useUser } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const lessonSchema = z.object({
  title: z.string().min(3, "Lesson title must be at least 3 characters."),
  videoUrl: z.string().url("Please enter a valid YouTube URL.").refine(
    (url) => url.includes("youtube.com/watch") || url.includes("youtu.be"),
    "Please provide a valid YouTube watch URL."
  ),
});

const sectionSchema = z.object({
  title: z.string().min(3, "Section title must be at least 3 characters."),
  lessons: z.array(lessonSchema).min(1, "Each section must have at least one lesson."),
});

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  topic: z.string().min(5, {
    message: "Topic must be at least 5 characters for AI generation.",
  }),
  keywords: z.string().min(3, {
    message: "Please provide at least one keyword for AI generation.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }),
  category: z.string({ required_error: "Please select a category." }),
  level: z.string({ required_error: "Please select a level." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  language: z.string({ required_error: "Please select a language." }),
  curriculum: z.array(sectionSchema).min(1, "Course must have at least one section."),
});

export function CreateCourseForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "",
      keywords: "",
      description: "",
      summary: "",
      price: 0,
      language: "English",
      curriculum: [{ title: "", lessons: [{ title: "", videoUrl: "" }] }],
    },
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "curriculum",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a course.",
      });
      return;
    }
    
    startTransition(async () => {
      try {
        const imageUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;
        const randomRating = Math.random() * (4.5 - 4.0) + 4.0;
        const randomReviewCount = Math.floor(Math.random() * (1500 - 200 + 1) + 200);

        const coursesCollection = collection(firestore, 'courses');
        await addDoc(coursesCollection, {
          ...values,
          instructorId: user.uid,
          instructorName: user.displayName,
          instructorAvatar: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          rating: parseFloat(randomRating.toFixed(1)),
          reviewCount: randomReviewCount,
          duration: '10 hours', // This can be calculated from lesson durations later
          enrolledStudents: 0,
          imageUrl: imageUrl,
          imageHint: values.category.toLowerCase(),
        });
        toast({
            title: "Course Created!",
            description: "Your new course has been successfully created.",
        });
        router.push("/dashboard/instructor");
      } catch (error) {
        console.error("Error creating course:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue creating your course. Please try again.",
        });
      }
    });
  }

  const handleGenerateContent = () => {
    startTransition(async () => {
      const { topic, keywords } = form.getValues();
      if (!topic || !keywords) {
        form.trigger(["topic", "keywords"]);
        return;
      }
      const result = await generateCourseDescriptionAction({ topic, keywords });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: result.error,
        });
      } else if (result.data) {
        form.setValue("description", result.data.description, { shouldValidate: true });
        form.setValue("summary", result.data.summary, { shouldValidate: true });
        toast({
          title: "Content Generated!",
          description: "Description and summary have been filled in.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Next.js 14" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid md:grid-cols-2 gap-8 p-6 border rounded-lg bg-secondary">
             <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>AI Content Generation Topic</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Modern Web Development" {...field} />
                    </FormControl>
                    <FormDescription>What is the main topic of your course?</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., React, TypeScript, Tailwind CSS" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated keywords for the AI.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <div className="md:col-span-2">
                <Button type="button" onClick={handleGenerateContent} disabled={isPending} className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isPending ? "Generating..." : "Generate Description & Summary with AI"}
                </Button>
            </div>
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Summary</FormLabel>
              <FormControl>
                <Input placeholder="A brief, one-sentence summary of your course." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Course Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your course in detail. What will students learn?"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Curriculum Builder */}
        <Card>
            <CardHeader>
                <CardTitle>Curriculum</CardTitle>
                <FormMessage>{form.formState.errors.curriculum?.root?.message}</FormMessage>
            </CardHeader>
            <CardContent className="space-y-6">
                {sectionFields.map((section, sectionIndex) => (
                    <div key={section.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                            <FormField
                                control={form.control}
                                name={`curriculum.${sectionIndex}.title`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormLabel>Section {sectionIndex + 1} Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Introduction" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(sectionIndex)} className="ml-4 mt-8 text-destructive">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        <LessonBuilder sectionIndex={sectionIndex} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSection({ title: "", lessons: [{ title: "", videoUrl: "" }]})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
            </CardContent>
        </Card>


        <div className="grid md:grid-cols-3 gap-8">
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 49.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Language</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                         <SelectItem value="English">English</SelectItem>
                         <SelectItem value="Spanish">Spanish</SelectItem>
                         <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Button type="submit" size="lg" className="bg-gradient-primary-accent text-primary-foreground" disabled={isPending}>
          {isPending ? "Creating..." : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}

function LessonBuilder({ sectionIndex }: { sectionIndex: number }) {
  const { control, formState: { errors } } = useFormContext<z.infer<typeof formSchema>>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `curriculum.${sectionIndex}.lessons`,
  });
  
  const sectionErrors = errors.curriculum?.[sectionIndex]?.lessons;

  return (
    <div className="pl-4 border-l-2 ml-2 space-y-4">
      <FormLabel>Lessons</FormLabel>
      {sectionErrors?.root && <FormMessage>{sectionErrors.root.message}</FormMessage>}

      {fields.map((lesson, lessonIndex) => (
        <div key={lesson.id} className="flex items-start gap-4">
          <div className="flex-grow space-y-2">
            <FormField
              control={control}
              name={`curriculum.${sectionIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Lesson Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`curriculum.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=...)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(lessonIndex)} className="mt-2 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", videoUrl: "" })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
      </Button>
    </div>
  );
}
