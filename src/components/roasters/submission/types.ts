
import { z } from 'zod';

// Form validation schema - email is truly optional
export const formSchema = z.object({
  name: z.string().min(2, { message: 'Roaster name must be at least 2 characters' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State or Country is required' }),
  website: z.string().optional(),
  instagram: z.string().optional(),
  email: z.union([
    z.string().email({ message: 'Please provide a valid email' }).optional(),
    z.literal('')
  ]).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface RoasterSubmissionData {
  name: string;
  city: string;
  state: string;
  website?: string | null;
  instagram?: string | null;
  email?: string | null;
  user_id?: string | null;
}
