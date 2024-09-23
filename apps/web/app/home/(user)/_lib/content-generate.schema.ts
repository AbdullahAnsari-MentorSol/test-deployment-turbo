import { z } from 'zod';

export const ContentGenerateSchema = z.object({
  topic: z.string().min(1).max(200),
  accountId: z.string(),
});