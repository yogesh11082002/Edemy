'use server';

/**
 * @fileOverview A flow for generating course descriptions and summaries using AI.
 *
 * - generateCourseDescription - A function that generates a course description and summary.
 * - GenerateCourseDescriptionInput - The input type for the generateCourseDescription function.
 * - GenerateCourseDescriptionOutput - The return type for the generateCourseDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseDescriptionInputSchema = z.object({
  topic: z.string().describe('The topic of the course.'),
  keywords: z.string().describe('Keywords related to the course topic, separated by commas.'),
});
export type GenerateCourseDescriptionInput = z.infer<typeof GenerateCourseDescriptionInputSchema>;

const GenerateCourseDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the course.'),
  summary: z.string().describe('A concise summary of the course.'),
});
export type GenerateCourseDescriptionOutput = z.infer<typeof GenerateCourseDescriptionOutputSchema>;

export async function generateCourseDescription(input: GenerateCourseDescriptionInput): Promise<GenerateCourseDescriptionOutput> {
  return generateCourseDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourseDescriptionPrompt',
  input: {schema: GenerateCourseDescriptionInputSchema},
  output: {schema: GenerateCourseDescriptionOutputSchema},
  prompt: `You are an AI assistant helping instructors create engaging course content. Generate a detailed course description and a concise summary based on the given topic and keywords.\n\nTopic: {{{topic}}}\nKeywords: {{{keywords}}}\n\nDescription:\nSummary:`, // Ensure the AI knows what is being asked of it.
});

const generateCourseDescriptionFlow = ai.defineFlow(
  {
    name: 'generateCourseDescriptionFlow',
    inputSchema: GenerateCourseDescriptionInputSchema,
    outputSchema: GenerateCourseDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
