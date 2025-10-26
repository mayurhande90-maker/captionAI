// src/ai/flows/generate-marketing-caption.ts
'use server';

/**
 * @fileOverview Generates marketing captions and hashtags for a given image.
 *
 * - generateMarketingCaption - A function that handles the caption and hashtag generation process.
 * - GenerateMarketingCaptionInput - The input type for the generateMarketingCaption function.
 * - GenerateMarketingCaptionOutput - The return type for the generateMarketingCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A marketing photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format
    ),
});

export type GenerateMarketingCaptionInput = z.infer<typeof GenerateMarketingCaptionInputSchema>;

const GenerateMarketingCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated marketing caption for the image.'),
  hashtags: z.array(z.string()).describe('An array of relevant hashtags for the image.'),
});

export type GenerateMarketingCaptionOutput = z.infer<typeof GenerateMarketingCaptionOutputSchema>;

export async function generateMarketingCaption(
  input: GenerateMarketingCaptionInput
): Promise<GenerateMarketingCaptionOutput> {
  return generateMarketingCaptionFlow(input);
}

const generateMarketingCaptionPrompt = ai.definePrompt({
  name: 'generateMarketingCaptionPrompt',
  input: {schema: GenerateMarketingCaptionInputSchema},
  output: {schema: GenerateMarketingCaptionOutputSchema},
  prompt: `You are an AI marketing assistant specializing in creating engaging social media content.

  Based on the uploaded marketing photo, generate a caption and a list of relevant hashtags to increase audience reach.

  Photo: {{media url=photoDataUri}}

  Caption: A creative and engaging caption for the photo.
  Hashtags: An array of relevant hashtags.`,
});

const generateMarketingCaptionFlow = ai.defineFlow(
  {
    name: 'generateMarketingCaptionFlow',
    inputSchema: GenerateMarketingCaptionInputSchema,
    outputSchema: GenerateMarketingCaptionOutputSchema,
  },
  async input => {
    const {output} = await generateMarketingCaptionPrompt(input);
    return output!;
  }
);
