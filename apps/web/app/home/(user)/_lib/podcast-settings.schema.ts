import { z } from 'zod';

export const PodcastSettingsSchema = z.object({
  podcast_prompt: z.string().max(2000, { message: "Podcast prompt cannot exceed 2000 characters" }),
  
  brand_information: z.string().max(2000, { message: "Business information cannot exceed 2000 characters" }),

  ai_model: z.enum(['GPT4o/mini', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Claude', 'Groq Llama 3.1 70B']),

  voices: z.enum(['0', '1', '2', '3', '4', '5']),

  style: z.array(z.string()).optional(),

  number_of_words: z.number().min(300, { message: "Minimum 300 words" }).max(2000, { message: "Maximum 2000 words" }),

  search_the_web: z.boolean(),

  quality: z.enum(['0', '1']),
});
