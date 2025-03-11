import { z } from 'zod';

export const loginUserDTO = z.object({
  email: z.string().email('Invalid email address.').nonempty('Email is required.'),
  password: z.string().nonempty('Password is required.') 
})

export type LoginUserDTO = z.infer<typeof loginUserDTO>;
