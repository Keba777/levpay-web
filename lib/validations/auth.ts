import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember_me: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration Step 1: Personal Info
export const personalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// Registration Step 2: Account Details
export const accountDetailsSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export type AccountDetailsData = z.infer<typeof accountDetailsSchema>;

// Registration Step 3: Verification (optional)
export const verificationSchema = z.object({
  phone: z.string().optional(),
  enable_2fa: z.boolean().optional(),
});

export type VerificationData = z.infer<typeof verificationSchema>;

// Complete registration data
export const registrationSchema = personalInfoSchema
  .merge(accountDetailsSchema)
  .merge(verificationSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// 2FA verification
export const twoFactorSchema = z.object({
  code: z.string().length(6, '2FA code must be 6 digits'),
});

export type TwoFactorData = z.infer<typeof twoFactorSchema>;
