import { z } from 'zod';

export const CreateCustomerParamsSchema = z.object({
  email: z.string().email().nullable(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
