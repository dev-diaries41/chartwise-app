import { OnboardingAnswers } from "./chartwise";

export interface JobResult<T> { 
    status: JobReceipt["status"]; 
    data: T; 
}

export interface JobReceipt {
    jobId: string | undefined;
    status: 'completed' | 'failed' | 'active' | 'delayed' | 'prioritized' | 'waiting' | 'waiting-children' | "unknown";
    queue: number;
    when: number;
    delay: number
   }

   export interface PaymentDetails {
    email: string | null;
    name: string;
    receipt_url: string | null;
    chargeId: string;
}

export type UserPlan = 'Free' | 'Basic' | 'Pro' | 'Elite';
export type UserPlanOverView = {plan: UserPlan; cancel_at_period_end?: boolean; cancelled? :boolean;}

export type UserProfileInfo = {
    userPlan: UserPlan, 
    expiresAt: number, 
}

export type UsagePeriod = keyof Usage

export type Usage = {
    today: number;
    month: number;
    total: number;
  }
  
  export interface UsageType {
    name: string;
    count: number;
  }

  export interface NewUser {
    email: string;
    password: string;
    name?: string;
    username?: string;
  }

  export interface User {
    email: string;
    salt: string; 
    hashedPassword: string;
    name?: string;
    username?: string;
    metadata?: UserMetadata;
  }
  
  export interface UserMetadata {
    answers?: OnboardingAnswers;
    creationDate?: Date;
    hasCompletedOnboarding?: boolean
  }

  
  export type OnboardingQuestions = {
    questionCategory: keyof OnboardingAnswers;
    question: string;
    options: string[];
    allowMultipleAnswers?: boolean
  }