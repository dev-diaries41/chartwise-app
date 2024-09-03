
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

  export interface User {
    name?: string;
    username?: string;
    email: string;
    password: string;
  }