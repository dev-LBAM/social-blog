import { z } from 'zod';

export const verifyEmailDTO = z.object({
  email: z.string().email('Invalid email address.').nonempty('Email is required.'),
  code: z.string().min(6, 'The code requires at least 1 character').nonempty('Code is required.')
}).partial()

export type VerifyEmailDTO = z.infer<typeof verifyEmailDTO>;
