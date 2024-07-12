import { z } from 'zod';

  export const ContactFormSchema = z.object({
    email: z.string({
      invalid_type_error: 'Please enter a valid email.',
    }).refine(
      (email) => email !== '',
      { message: 'Email cannot be empty.' }
    ),
    feedback: z.string({
      invalid_type_error: 'Please enter a valid message.',
    }).refine(
      (feedback) => feedback !== '',
      { message: 'Message cannot be empty.' }
    ),
    feedbackType: z.string({
      invalid_type_error: 'Please enter a valid name.',
    }).refine(
      (feedbackType) => feedbackType !== '',
      { message: 'Feedback type cannot be empty.' }
    ),
  });
