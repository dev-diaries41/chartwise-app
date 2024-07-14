import { StorageKeys } from "@/app/constants/app";
import { AuthErrors, MiscErrors, RequestErrors, ToolErrors } from "../../constants/errors";
import * as Storage from "@/app/lib/storage"
import {JobReceipt, UserPlan} from "@/app/types"

export function getAuthHeaders (){
    const currentToken = Storage.get(StorageKeys.token);
    if (!currentToken || typeof currentToken !=='string' ) throw new Error(AuthErrors.MISSING_JWT_TOKEN);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${currentToken}`);
    return headers;
  };

  export async function getNewToken({ userId }: { userId: string}): Promise<string> {
    try {
      if (!userId) throw new Error(AuthErrors.INVALID_USER_ID);
  
      const formData = new FormData();
      formData.append('userId', userId);
    
      const response = await fetch('/api/auth/token', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Failed to fetch token: ${response.statusText}`);
  
      const authHeader = response.headers.get('Authorization');
      const newToken = authHeader?.split(' ')[1];
      if (!newToken) throw new Error('Failed to get token');
  
      Storage.set(StorageKeys.token, newToken);
      return newToken;
    } catch (error: any) {
      console.error('Error in getNewToken:', error.message);
      throw error
    }
  }
  
  export async function getJobStatus (jobId: string): Promise<{data: {output: string}, status: JobReceipt["status"]}> {
    const headers = getAuthHeaders();
    const endpointUrl = `/api/analysis/results?jobId=${jobId}`;
    const response = await fetch(endpointUrl, { method: 'GET', headers });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || RequestErrors.POLLING_ERROR);
    }
  
    const newToken = response.headers.get('Authorization')?.split(' ')[1];
    if (newToken) Storage.set(StorageKeys.token, newToken);
  
    const { data, status, message } = await response.json();
    if (!data) throw new Error(message || RequestErrors.POLLING_ERROR);
  
    return { data, status };
  };

  export async function submitAnalysisRequest(formData: FormData): Promise<string> {
    const endpointUrl = '/api/analysis';
    const headers = getAuthHeaders();
  
    const response = await fetch(endpointUrl, { method: 'POST', body: formData, headers });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || ToolErrors.CHART_ANALYSIS);
    }
  
    const newToken = response.headers.get('Authorization')?.split(' ')[1];
    if (newToken) Storage.set(StorageKeys.token, newToken);
  
    const { message, data } = await response.json();
    if (!data?.jobId) throw new Error(message || MiscErrors.UNKNOWN_ERROR);
  
    return data.jobId;
  };

  export async function getUsage (userId: string | null | undefined, plan: UserPlan): Promise<number> {
    if(!userId)return 0
    const headers = getAuthHeaders();
    const endpointUrl = plan === 'Free'? `/api/usage/daily?userId=${userId}` : `/api/usage/monthly?userId=${userId}`;
    const response = await fetch(endpointUrl, { method: 'GET', headers });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
  
    const newToken = response.headers.get('Authorization')?.split(' ')[1];
    if (newToken) Storage.set(StorageKeys.token, newToken);
  
    const { data, message } = await response.json();
    const credits = data;
    if (!credits) throw new Error(message);
  
    return credits ;
  };
  

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
            throw error; // Propagate error if retry conditions are not met
          }
        } else {
          throw error; // Max retries exceeded
        }
      } finally {
        this.reset();
      }
    }
  
    reset() {
      this.currentRetry = 0;
    }
  }

  export async function saveAnalysis (analysis: string, chart: string): Promise<string | null> {
    try {
      const headers = getAuthHeaders();
      const formData = new FormData();
      formData.append('analysis', analysis);
      formData.append('chart', chart);
      const response = await fetch('/api/analysis/save', {method: 'POST',body: formData, headers});
      if (!response.ok) throw new Error('Failed to save analysis');
      
      const {data} = await response.json();
      const id = data;
      const shareableUrl = `${window.location.origin}/share/${id}`;
      return shareableUrl;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return null;
    }
  };

  export async function getSharedAnalysis (id: string) {
    try {
      const endpointUrl = `/api/analysis/share?id=${id}`;
      const response = await fetch(endpointUrl, { method: 'GET' });
      if (!response.ok) throw new Error('Failed to save analysis');

      const data = await response.json();
      return data as {analysis: string, chartUrl: string};
    } catch (error: any) {
      console.error('Error in getSavedAnalysis:', error.message);
      throw error
    }
  };
  
  