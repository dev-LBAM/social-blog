import { z } from 'zod'

const passwordSchema = z
    .string()
    .min(60, 'Password must be at least 60 characters long.')
    .max(72, 'Password must be at most 72 characters long.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &).')

export const registerUserDTO = z.object(
{
    name: z.string().min(3, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    password: passwordSchema,
    birthDate: z.date(),
    city: z.string().min(3, 'City is required.'),
    state: z.string().min(3, 'state is required.'),
    country: z.string().min(5, 'Country is required.')
})

export type RegisterUserDTO = z.infer<typeof registerUserDTO>
