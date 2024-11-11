'use server'
import { NOTIFICATIONS_CONFIG } from '@/app/constants/support';
import { Notify } from 'notify-utils';
import { CompletePasswordResetFormSchema, ContactFormSchema, RegistrationFormSchema, ResetPasswordFormSchema } from '@/app/constants/schemas';
import { CompleteResetState, FeedbackState, NewUser, RegistrationState, ResetState } from '@/app/types';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'
import { RequestErrors } from '../constants/errors';
import {ACCOUNT_EXISTS, CHECK_EMAIL_MESSAGE, EMAIL_MESSAGE, PASSWORDS_DO_NOT_MATCH, REGISTRATION_FAILED, REGISTRATION_SUCCESS, RESET_FAILED, RESET_SUCCESS} from '@/app/constants/messages';
import { isValidUser, signUp, updatePassword } from './data/user';
import { generateAccessUrl } from './auth';
import { sendEmail } from './email';


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


export async function sendPasswordResetEmail(prevState: ResetState, formData: FormData) {
  try {
    const formResults = ResetPasswordFormSchema.safeParse({
      email: formData.get('email'),
    });

    if (!formResults.success) {
      return {
        errors: formResults.error.flatten().fieldErrors,
        message: RESET_FAILED,
      };
    }
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;
    const url = await generateAccessUrl(formResults.data, baseUrl, { expiresIn:'10m' });
    const resetPasswordEmailMessage = `${EMAIL_MESSAGE}:\n\n${url}`
    const isValid = await isValidUser(formResults.data.email);
    if(isValid){
      await sendEmail(formResults.data.email, 'Password reset', resetPasswordEmailMessage)
    }
    return {message: CHECK_EMAIL_MESSAGE}
  } catch (error) {
    return {message:'Something went wrong.'};
  }
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
      message: 'Registration unsuccessful. Missing fields',
    };
  }

  try {
    const { email, password, confirmPassword } = formResults.data;
    if(password!== confirmPassword) return { message: 'Passwords do not match'}

    const newUser: NewUser = {email, password}
    const result = await signUp(newUser);
    if(!result.success)throw new Error(result.message);

    return {message: REGISTRATION_SUCCESS};
  } catch (error: any) {
    console.error("Error in registering user:", error.message);
    if(error.message.includes(RequestErrors.DUPLICATE)) {
      return {message: ACCOUNT_EXISTS};
    }
    return {message: REGISTRATION_FAILED};
  }
}

export async function resetPassword(prevState: CompleteResetState, formData: FormData, email: string) {
  const formResults = CompletePasswordResetFormSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  });

  if (!formResults.success) {
    return {
      errors: formResults.error.flatten().fieldErrors,
      message: RESET_FAILED,
    };
  }

  try {
    const { password, confirmPassword } = formResults.data;
    if(password!== confirmPassword) return { message: PASSWORDS_DO_NOT_MATCH}

    const result = await updatePassword(email, password);
    if(!result.success)throw new Error(result.message);

    return {message: RESET_SUCCESS};
  } catch (error: any) {
    console.error("Error in complete password reset:", error.message);
    return {message: RESET_FAILED};
  }
}


export async function sendNotification(prevState: FeedbackState, formData: FormData) {
  const notify = new Notify(NOTIFICATIONS_CONFIG)
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