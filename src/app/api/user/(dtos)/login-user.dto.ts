import { z } from 'zod'

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(20, 'Password must be at most 20 characters long.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &).')

export const loginUserDTO = z.object(
{
    email: z.string().email('Invalid email address.'),
    password: passwordSchema,
})

export type LoginUserDTO = z.infer<typeof loginUserDTO>
