import { z } from 'zod';

export const UserTypeEnum = z.enum(['Parent', 'Student', 'School'], {
  errorMap: () => ({ message: "User Type must be one of: 'Parent', 'Student', or 'School'" }),
});

export const CategoryEnum = z.enum(['Scholarship', 'Concert', 'Admission', 'General Query'], {
  errorMap: () => ({ message: "Category must be one of: 'Scholarship', 'Concert', 'Admission', or 'General Query'" }),
});

export const StatusEnum = z.enum(['new', 'in_progress', 'resolved'], {
  errorMap: () => ({ message: "Status must be one of: 'new', 'in_progress', or 'resolved'" }),
});

// Schema for public inquiry submission
export const createInquirySchema = z.object({
  user_type: UserTypeEnum,
  category: CategoryEnum,
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[+0-9\s()-]+$/, 'Phone number contains invalid characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(5, 'Message must be at least 5 characters long')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

// Schema for inquiry list query parameters
export const listInquiriesQuerySchema = z.object({
  user_type: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Schema for status update
export const updateStatusSchema = z.object({
  status: StatusEnum,
});

