'use client'
import {OnboardingAnswers, User} from "@/app/types"
import { FindOneAndUpdateResponse } from "@/app/types/response";

async function fetchWithError<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpointUrl, options);
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
  return await response.json();
}

export async function completedOnboarding(email: string | null | undefined, answers: OnboardingAnswers): Promise<void> {
  try{
    const body = JSON.stringify({email, answers});
    const endpointUrl = '/api/onboarding';
    await fetchWithError<{data: FindOneAndUpdateResponse<User>}>(endpointUrl, { method: 'POST', body});
  }catch(error){
    console.error('Failed to update users onboarding answers');
  }
}