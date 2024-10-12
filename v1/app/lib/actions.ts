'use server'
import { NOTIFICATIONS_CONFIG } from '@/app/constants/support';
import { Notify } from 'notify-utils';
import { ContactFormSchema, RegistrationFormSchema } from '@/app/constants/schemas';
import Stripe from 'stripe';
import { FeedbackState, NewUser, RegistrationState } from '@/app/types';
import { stripe } from '../stripe';
import { signIn, signUp, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'

const notify = new Notify(NOTIFICATIONS_CONFIG)

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
  redirect('/dashboard')
}

export async function logout(){
  await signOut({
    redirect: true,
    redirectTo: '/'
  })
}


export async function register(prevState: RegistrationState, formData: FormData) {
  const formResults = RegistrationFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  });

  if (!formResults.success) {
    return {
      errors: formResults.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to send email.',
    };
  }

  try {
    const { email, password, confirmPassword } = formResults.data;

    if(password!== confirmPassword) return {
      message: 'Passwords do not match',
    }

    const newUser: NewUser = {email, password}
    await signUp(newUser);
    return {message: 'Registration successful'};

  } catch (error: any) {
    console.error("Error in registering user:", error.message);
    return {message: 'Registration failed'};
  }
}

export async function sendNotification(prevState: FeedbackState, formData: FormData) {
  const formResults = ContactFormSchema.safeParse({
    email: formData.get('email'),
    feedbackType: formData.get('feedback-type'),
    feedback: formData.get('feedback'),
  });

  if (!formResults.success) {
    return {
      errors: formResults.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to send email.',
    };
  }

  try {
    const { feedbackType, email, feedback } = formResults.data;
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
