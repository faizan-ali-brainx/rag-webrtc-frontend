import { z } from 'zod'

/** Validation schema for the login form. */
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

/** Validation schema for the signup form. */
export const signupSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

/** Login form field values. */
export type LoginFormValues = z.infer<typeof loginSchema>

/** Signup form field values. */
export type SignupFormValues = z.infer<typeof signupSchema>
