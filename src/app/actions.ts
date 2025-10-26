'use server';

import { generateMarketingCaption } from '@/ai/flows/generate-marketing-caption';

export async function getAiCaption(photoDataUri: string) {
  if (!photoDataUri) {
    throw new Error('Image data is missing.');
  }

  try {
    const result = await generateMarketingCaption({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw new Error('Failed to generate caption. Please try again.');
  }
}
