import { z } from 'zod'

const passwordSchema = z
    .string()
    .min(60, 'Password must be at least 60 characters long.')
    .max(72, 'Password must be at most 72 characters long.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &).')

const phoneSchema = z
.string()
.regex(/^(\+55)?\s?(?:\(?[1-9][0-9]\)?)\s?(?:9[1-9][0-9]{3}-?[0-9]{4})$/, 'Invalid phone number format. Example: +55 11 91234-5678')

export const updateUserDTO = z.object(
{
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    password: passwordSchema,
    phone: phoneSchema,
    age: z.number().min(13, 'Minimum age is 13 years old.').max(130),
    birthDate: z.date(),
    city: z.string().min(1, 'City is required.'),
    country: z.string().min(1, 'Country is required.')
}).partial()

export type UpdateUserDTO = z.infer<typeof updateUserDTO>
