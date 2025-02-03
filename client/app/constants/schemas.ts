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


  
  
  
  export const AnalysisParamsSchema = z.object({
    chartUrls: z.array(z.string().min(10, { message: "Each chart URL must be at least 10 characters long." })),
    metadata: z.object({
      strategyAndCriteria: z.string().optional(),
      risk: z.number().optional(),
    }).refine((data) => typeof data.strategyAndCriteria === 'undefined' || typeof data.strategyAndCriteria === 'string', { message: "strategyAndCriteria must be a string" })
      .refine((data) => typeof data.risk === 'undefined' || typeof data.risk === 'number', { message: "risk must be a number" })
  });

  export const AnalysisSchema = AnalysisParamsSchema.extend({
    name: z.string().min(1, { message: "Analysis name must be at least 1 characters long." }),
    output: z.string().min(1, { message: "Analysis must be at least 1, characters long." }),
    userId: z.string().min(1, { message: "User ID is required." }), 
    formatVersion: z.number().optional(),
  });

  export const AnalysisSchemaWithoutUserId = AnalysisSchema.omit({ userId: true });


  export const TradeJournalEntrySchema = z.object({
    entryId: z.string({
      required_error: 'Entry ID is required',
      invalid_type_error: 'Entry ID must be a string',
    }).min(1),
    userId: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),
    tradeDate: z.preprocess((arg) => {
      return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date({
      required_error: 'Trade Date is required',
      invalid_type_error: 'Trade Date must be a valid date',
    })),
    symbol: z.string({
      required_error: 'Symbol is required',
      invalid_type_error: 'Symbol must be a string',
    }),
    type: z.enum(['buy', 'sell'], {
      required_error: 'Type is required',
      invalid_type_error: 'Type must be either "buy" or "sell"',
    }),
    quantity: z.number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    }).min(1, { message: 'Quantity must be greater than 0' }),
    entryPrice: z.number({
      required_error: 'Entry Price is required',
      invalid_type_error: 'Entry Price must be a number',
    }).min(0, { message: 'Entry Price must be a non-negative number' }),
    stopLoss: z.number({
      invalid_type_error: 'Stop Loss must be a number',
    }).optional()
      .refine(value => value === undefined || value >= 0, {
        message: 'Stop Loss must be a non-negative number',
      }),
    takeProfit: z.number({
      invalid_type_error: 'Take Profit must be a number',
    }).optional()
      .refine(value => value === undefined || value >= 0, {
        message: 'Take Profit must be a non-negative number',
      }),
    comments: z.string({
      invalid_type_error: 'Comments must be a string',
    }).optional(),
    sentiment: z.enum(['bullish', 'bearish', 'neutral'], {
      invalid_type_error: 'Sentiment must be one of "bullish", "bearish", or "neutral"',
    }).optional(),
    createdAt: z.preprocess((arg) => {
      return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date({
      required_error: 'Created At is required',
      invalid_type_error: 'Created At must be a valid date',
    })),
    updatedAt: z.preprocess((arg) => {
      return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date({
      required_error: 'Updated At is required',
      invalid_type_error: 'Updated At must be a valid date',
    })),
  });
  
  export const TradeJournalEntrySchemaNoUser = TradeJournalEntrySchema.omit({ userId: true });

  export const UserSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const RegistrationFormSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const CompletePasswordResetFormSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const ResetPasswordFormSchema = z.object({
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
  });
  
  
