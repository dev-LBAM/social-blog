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
    username: z.string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(30, 'Username can be at most 30 characters long.')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens.')
    .nonempty('Username is required.'),
    name: z.string()
    .min(3, 'Name must be at least 3 characters long.')
    .max(100, 'Name can be at most 100 characters long.')
    .regex(
        /^(?=.{3,100}$)(?=.*[a-zA-Zà-úÀ-Ú])(?=.*\s)[a-zA-ZàáâãäåèéêëìíîïòóôõöùúûüçÇ\s]+$/,
        'Name must contain at least two words and only letters, spaces, and accents.'
    )
    .nonempty('Name is required.'),

    email: z.string().email('Invalid email address.'),
    password: passwordSchema,
    phone: phoneSchema,
    birthDate: z.date(),
    city: z.string().min(3, 'City is required.'),
    country: z.string().min(5, 'Country is required.'),
    followerCount: z.number(),
    postCount: z.number(),
    profileImg: z.string().url()
}).partial()

export type UpdateUserDTO = z.infer<typeof updateUserDTO>
