import { z } from 'zod';

export const PodcastGenerateSchema = z.object({
  content: z.string(),
  accountId: z.string()
});