
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
import { useFirestore } from "@/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/lib/types";

const lessonSchema = z.object({
  title: z.string().min(3, "Lesson title must be at least 3 characters."),
  videoUrl: z.string().url("Please enter a valid video URL."),
});

const sectionSchema = z.object({
  title: z.string().min(3, "Section title must be at least 3 characters."),
  lessons: z.array(lessonSchema).min(1, "Each section must have at least one lesson."),
});

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
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


interface EditCourseFormProps {
    course: Course;
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      summary: course.summary,
      category: course.category,
      level: course.level,
      price: course.price,
      language: course.language,
      curriculum: course.curriculum || [{ title: "", lessons: [{ title: "", videoUrl: "" }] }],
    },
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "curriculum",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const courseRef = doc(firestore, 'courses', course.id);
        await updateDoc(courseRef, {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast({
            title: "Course Updated!",
            description: "Your course has been successfully updated.",
        });
        router.push("/dashboard/instructor");
      } catch (error) {
        console.error("Error updating course:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue updating your course. Please try again.",
        });
      }
    });
  }

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
          {isPending ? "Saving..." : "Save Changes"}
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
                    <Input placeholder="Video URL (e.g., YouTube, Vimeo)" {...field} />
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
