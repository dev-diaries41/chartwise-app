'use server'

import { NOTIFICATIONS_CONFIG } from '@/app/constants/support';
import { Notify } from 'notify-utils';
import { ContactFormSchema } from '@/app/constants/schemas';
import Stripe from 'stripe';
import { FeedbackState } from '@/app/types';
import { stripe } from '../stripe';

const notify = new Notify(NOTIFICATIONS_CONFIG)

export async function validateFeedbackForm(formData: FormData){
    const validatedFields = await ContactFormSchema.safeParse({
      email: formData.get('email'),
      feedbackType: formData.get('feedback-type'),
      feedback: formData.get('feedback'),
    });
  
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        success: validatedFields.success,
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to send email.',
      };
    }
  
    return {success: validatedFields.success, validatedFormData: validatedFields.data}
  }

export async function sendNotification(prevState: FeedbackState, formData: FormData) {
  const {success, errors, message, validatedFormData} = await validateFeedbackForm(formData);

  // If form validation fails, return errors early. Otherwise, continue.
  if(!success){return {errors, message}}

  try {
    const { feedbackType, email, feedback } = validatedFormData;
    const message = `Feedback Type: ${feedbackType}\nEmail: ${email}\nMessage: ${feedback}`
    const result = await notify.broadcast([{discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL}], message)

    return result.success? {message: 'MESSAGE SENT'} : {message: 'MESSAGE FAILED'};

  } catch (error: any) {
    console.error("Error in sendNotification:", error.message);
    return {message: 'MESSAGE FAILED'};
  }
}

export async function getSubscription(email: string):Promise<{subscription: Stripe.Subscription;} | null> {
  try {
    const customer = await stripe.customers.list({
      email,
      limit: 1,
    });
  
    if (customer.data.length === 0) return null;
  
    const subscription = await stripe.subscriptions.list({
      limit: 1,
      customer: customer.data[0].id,
    });

    if (subscription.data.length === 0) return null;

    return {
      subscription: subscription.data[0],
    };
  } catch (err:any) {
    console.error(err.message)
    return null;
  }
}
