import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(20, 'Password must be at most 20 characters long.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &).')
    .nonempty('Password is required.');

export const registerUserDTO = z.object({
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

    email: z.string().email('Invalid email address.').nonempty('Email is required.'),
    password: passwordSchema,
    confirmPassword: z.string().nonempty('Please confirm your password.'),
    gender: z.string().nonempty('Gender is required.'),
    birthDate: z.string().nonempty("Birthdate is required."),
    city: z.string().nonempty('City is required.'),
    state: z.string().nonempty('State is required.'),
    country: z.string().nonempty('Country is required.')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
});

export type RegisterUserDTO = z.infer<typeof registerUserDTO>;
