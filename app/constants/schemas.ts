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

  export const storedAnalysisSchema = z.object({
    analysis: z.string().min(1, { message: "Analysis must be at least 100 characters long." }),
    chartUrls: z.array(z.string().min(10, { message: "Each chart URL must be at least 10 characters long." })),
    userId: z.string().min(1, { message: "User ID is required." }), // Ensuring it's not an empty string
    formatVersion: z.number().optional(),
    metadata: z.record(z.any()).optional().refine(val => typeof val === 'object', { message: "Metadata must be an object." }),
  });
  
  
  export const storedAnalysisWithoutUserIdSchema = storedAnalysisSchema.omit({ userId: true });
  
  export const analyseChartSchema = z.object({
    chartUrls: z.array(z.string().min(10, { message: "Each chart URL must be at least 10 characters long." })),
    metadata: z.object({
      strategyAndCriteria: z.string().optional(),
      risk: z.string().optional(),
    }).refine((data) => typeof data.strategyAndCriteria === 'undefined' || typeof data.strategyAndCriteria === 'string', { message: "strategyAndCriteria must be a string" })
      .refine((data) => typeof data.risk === 'undefined' || typeof data.risk === 'string', { message: "risk must be a string" })
  });
  
  
