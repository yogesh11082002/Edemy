"use server";

import { generateCourseDescription, GenerateCourseDescriptionInput, GenerateCourseDescriptionOutput } from "@/ai/flows/generate-course-description";

export async function generateCourseDescriptionAction(
  input: GenerateCourseDescriptionInput
): Promise<{ data: GenerateCourseDescriptionOutput | null; error: string | null }> {
  try {
    const output = await generateCourseDescription(input);
    return { data: output, error: null };
  } catch (error) {
    console.error("Error generating course description:", error);
    if (error instanceof Error) {
        return { data: null, error: error.message };
    }
    return { data: null, error: "An unknown error occurred." };
  }
}
