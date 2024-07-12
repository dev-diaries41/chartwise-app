import { StorageKeys } from "@/app/constants/app";
import { AuthErrors, MiscErrors, RequestErrors } from "../../constants/errors";
import * as Storage from "@/app/lib/storage";
import { JobReceipt, UserPlan } from "@/app/types";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = getAuthHeaders();
  const response = await fetch(url, { ...options, headers });
  
  const newToken = response.headers.get('Authorization')?.split(' ')[1];
  if (newToken) Storage.set(StorageKeys.token, newToken);

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || RequestErrors.REQUEST_ERROR);
  }

  return response.json();
}

export function getAuthHeaders() {
  const currentToken = Storage.get(StorageKeys.token);
  if (!currentToken || typeof currentToken !== 'string') {
    throw new Error(AuthErrors.MISSING_JWT_TOKEN);
  }
  return new Headers({ 'Authorization': `Bearer ${currentToken}` });
}

export async function getNewToken({ userId }: { userId: string }): Promise<string> {
  if (!userId) throw new Error(AuthErrors.INVALID_USER_ID);

  const formData = new FormData();
  formData.append('userId', userId);

  const { headers } = await fetchWithAuth('/api/auth/token', {
    method: 'POST',
    body: formData,
  });

  const newToken = headers.get('Authorization')?.split(' ')[1];
  if (!newToken) throw new Error(AuthErrors.MISSING_JWT_TOKEN);

  Storage.set(StorageKeys.token, newToken);
  return newToken;
}

export async function getJobStatus(jobId: string): Promise<{ data: { output: string }, status: JobReceipt["status"] }> {
  const { data, status } = await fetchWithAuth(`/api/analysis/results?jobId=${jobId}`, { method: 'GET' });
  if (!data) throw new Error(MiscErrors.UNKNOWN_ERROR);
  return { data, status };
}

export async function submitAnalysisRequest(formData: FormData): Promise<string> {
  const { data } = await fetchWithAuth('/api/analysis', {
    method: 'POST',
    body: formData,
  });
  if (!data?.jobId) throw new Error(MiscErrors.UNKNOWN_ERROR);
  return data.jobId;
}

export async function getUsage(userId: string | null | undefined, plan: UserPlan): Promise<number> {
  if (!userId) return 0;
  
  const endpointUrl = plan === 'Free' ? `/api/usage/daily?userId=${userId}` : `/api/usage/monthly?userId=${userId}`;
  const { data, message } = await fetchWithAuth(endpointUrl, { method: 'GET' });
  
  if (!data) throw new Error(message);
  return data;
}

export class RetryHandler {
  private maxRetries: number;
  private currentRetry: number;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
    this.currentRetry = 0;
  }

  async retry<T>(func: () => Promise<T>, errorHandler: (error: any) => Promise<boolean>): Promise<T> {
    try {
      return await func();
    } catch (error) {
      if (this.currentRetry < this.maxRetries) {
        this.currentRetry++;
        const shouldRetry = await errorHandler(error);
        if (shouldRetry) {
          return await this.retry(func, errorHandler);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    } finally {
      this.reset();
    }
  }

  reset() {
    this.currentRetry = 0;
  }
}

export async function saveAnalysis(analysis: string, chart: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('analysis', analysis);
    formData.append('chart', chart);
    
    const { data } = await fetchWithAuth('/api/analysis/save', {
      method: 'POST',
      body: formData,
    });

    const shareableUrl = `${window.location.origin}/share/${data}`;
    return shareableUrl;
  } catch (error) {
    console.error('Error in saveAnalysis:', error);
    return null;
  }
}

export async function getSharedAnalysis(id: string) {
  try {
    const { analysis, chartUrl } = await fetchWithAuth(`/api/analysis/share?id=${id}`, { method: 'GET' });
    return { analysis, chartUrl };
  } catch (error: any) {
    console.error('Error in getSavedAnalysis:', error.message);
    throw error;
  }
}
