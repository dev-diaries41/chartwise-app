'use server'
import { NOTIFICATIONS_CONFIG } from '@/app/constants/support';
import { Notify } from 'notify-utils';
import { ContactFormSchema, RegistrationFormSchema } from '@/app/constants/schemas';
import { FeedbackState, NewUser, RegistrationState } from '@/app/types';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'
import { RequestErrors } from '../constants/errors';
import * as AuthMessages from '../constants/registration';
import { signUp } from './user';

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
    if(password!== confirmPassword) return { message: 'Passwords do not match'}

    const newUser: NewUser = {email, password}
    const result = await signUp(newUser);
    if(!result.success)throw new Error(result.message);

    return {message: AuthMessages.REGISTRATION_SUCCESS};
  } catch (error: any) {
    console.error("Error in registering user:", error.message);
    if(error.message.includes(RequestErrors.DUPLICATE)) {
      return {message: AuthMessages.ACCOUNT_EXISTS};
    }
    return {message: AuthMessages.REGISTRATION_FAILED};
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
