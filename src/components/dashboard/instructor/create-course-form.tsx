"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, levels } from "@/lib/placeholder-data";

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
});

export function CreateCourseForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "",
      keywords: "",
      description: "",
      summary: "",
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
        title: "Course Created!",
        description: "Your new course has been successfully created.",
    })
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
        </div>

        <Button type="submit" size="lg" className="bg-gradient-primary-accent text-primary-foreground">
          Create Course
        </Button>
      </form>
    </Form>
  );
}
