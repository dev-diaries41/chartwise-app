'use client'
import { AnalysisSchemaWithoutUserId } from "@/app/constants/schemas";
import { AuthErrors, JobErrors } from "@/app/constants/errors";
import {JobReceipt, JobResult, IAnalysis, AnalysisParams, OnboardingAnswers, User} from "@/app/types"
import { FindOneAndUpdateResponse } from "@/app/types/response";

async function fetchWithError<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpointUrl, options);
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
  return await response.json();
}

export async function getNewToken({ email }: { email: string}){
    if (!email) throw new Error(AuthErrors.INVALID_USER_ID);

    const body = JSON.stringify({email})
    const response = await fetch('/api/analysis/auth', { method: 'POST', body });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message)
    };
}

export async function getJobStatus(jobId: string): Promise<JobResult<{ output: string }>> {
  const endpointUrl = `/api/analysis/results?jobId=${encodeURIComponent(jobId)}`;
  const  {data} = await fetchWithError<{data: JobResult<{ output: string }>}>(endpointUrl, { method: 'GET', credentials: 'include' });
  return data;
}

export async function submitAnalysisRequest(analysis: AnalysisParams): Promise<JobReceipt> {
  const body = JSON.stringify(analysis);
  const endpointUrl = '/api/analysis';
  const {data} = await fetchWithError<{data: JobReceipt}>(endpointUrl, { method: 'POST', body, credentials: 'include' });
  return data;
}

// User id sent via jwt
export async function saveAnalysis(analysis: Omit<IAnalysis, 'userId'>): Promise<string | null> {
  try {
    const validatedAnalysis = AnalysisSchemaWithoutUserId.safeParse(analysis);
    if (!validatedAnalysis.success) throw new Error(JSON.stringify(validatedAnalysis.error));

    const body = JSON.stringify(validatedAnalysis.data);
    const response = await fetchWithError<{ data: string }>('/api/analysis/save', {method: 'POST', body, credentials: 'include'});
    const id = response.data;
    const shareableUrl = `${window.location.origin}/share/${id}`;
    return shareableUrl;
  } catch (error: any) {
    // console.log('Error saving analysis: ', error.message)
    return null;
  }
}
export async function refreshOnError(error: Error, email: string){
  const shouldRetry = error.message.trim() === AuthErrors.MISSING_JWT_TOKEN || error.message.trim() === AuthErrors.EXPIRED_TOKEN;
  if (shouldRetry) {
    await getNewToken({ email });
    return shouldRetry;
  }
  return shouldRetry;
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