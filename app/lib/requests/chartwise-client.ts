'use client'
import { StorageKeys } from "@/app/constants/app";
import { AuthErrors, JobErrors } from "../../constants/errors";
import {SessionStorage} from "@/app/lib/storage"
import {JobReceipt, JobResult, User, StoredAnalysis, TradeJournalEntry, Usage, UsagePeriod, IAnalyseCharts} from "@/app/types"
import { validateAnalysis } from "../validation";
import { GetDocsResponse } from "@/app/types/response";

 function getAuthHeaders (){
    const currentToken = SessionStorage.get<string>(StorageKeys.token);
    if (!currentToken || typeof currentToken !=='string' ) throw new Error(AuthErrors.MISSING_JWT_TOKEN);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${currentToken}`);
    return headers;
  }; 

  async function fetchWithError<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpointUrl, options);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
    return await response.json();
  }

  export async function getNewToken({ userId }: { userId: string}): Promise<string> {
      if (!userId) throw new Error(AuthErrors.INVALID_USER_ID);

      const body = JSON.stringify({userId})
      const response = await fetch('/api/auth/token', { method: 'POST', body });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message)
      };
  
      const authHeader = response.headers.get('Authorization');
      const newToken = authHeader?.split(' ')[1];
      if (!newToken) throw new Error('Failed to get token');
  
      SessionStorage.set(StorageKeys.token, newToken);
      return newToken;
  }
  
  export async function getJobStatus(jobId: string): Promise<JobResult<{ output: string }>> {
    const endpointUrl = `/api/analysis/results?jobId=${encodeURIComponent(jobId)}`;
    const headers = getAuthHeaders();
    const  {data} = await fetchWithError<{data: JobResult<{ output: string }>}>(endpointUrl, { method: 'GET', headers });
    return data;
  }
  
  export async function submitAnalysisRequest(analysis: IAnalyseCharts): Promise<string> {
    const body = JSON.stringify(analysis);
    const endpointUrl = '/api/analysis';
    const headers = getAuthHeaders();
    const {data} = await fetchWithError<{data: JobReceipt}>(endpointUrl, { method: 'POST', body, headers });
    if (!data?.jobId) throw new Error(JobErrors.INVALID_JOB_ID);
    return data.jobId;
  }
  
  export async function getUsage(userId: string | null | undefined, period: UsagePeriod): Promise<number> {
    if (!userId) return 0
    const endpointUrl = `/api/usage?period=${encodeURIComponent(period)}&userId=${encodeURIComponent(userId)}`;
    const { data } = await fetchWithError<{data: number}>(endpointUrl, { method: 'GET' });
    return data;
  }

  export async function getAllUsage(userId: string | null | undefined): Promise<Usage | null>{
    try {
      const [today, month, total] = await Promise.all([
        getUsage(userId, 'today'),
        getUsage(userId, 'month'),
        getUsage(userId, 'total')
      ]);
      return { today, month, total };      
    } catch (error) {
      return null;
    }
  }

  // User id sent via jwt
  export async function saveAnalysis(analysis: Omit<StoredAnalysis, 'userId'>): Promise<string | null> {
    try {
      const validatedAnalysis = validateAnalysis(analysis);
      if (!validatedAnalysis.success) throw new Error(JSON.stringify(validatedAnalysis.error));
  
      const headers = getAuthHeaders();
      const body = JSON.stringify(validatedAnalysis.data);
      const response = await fetchWithError<{ data: string }>('/api/analysis/save', {method: 'POST', headers, body});
      const id = response.data;
      const shareableUrl = `${window.location.origin}/share/${id}`;
      return shareableUrl;
    } catch (error) {
      return null;
    }
  }
  

  export async function getSharedAnalysis(id: string): Promise<StoredAnalysis> {
      const endpointUrl = `/api/analysis/share?id=${id}`;
      const response = await fetchWithError<{ data: StoredAnalysis }>(endpointUrl, { method: 'GET' });
      return response.data;
  }
  

  export async function addJournalEntry(entry: TradeJournalEntry): Promise<string> {
    const endpointUrl = '/api/journal';
    const headers = getAuthHeaders();
    const body = JSON.stringify(entry); 
    const { message } = await fetchWithError<{ message: string }>(endpointUrl, { method: 'POST', body, headers });
    return message;
  }
  
  export async function getJournalEntries (page: string | number, perPage: string | number): Promise<GetDocsResponse<TradeJournalEntry>> {
    const endpointUrl = `/api/journal?page=${page}&perPage=${perPage}`;
    const headers = getAuthHeaders();
    const  {data} = await fetchWithError<{data: GetDocsResponse<TradeJournalEntry>}>(endpointUrl, { method: 'GET', headers });
    return data;
};


  export async function login(email: string, password: string): Promise<void> {
    const body = JSON.stringify({email, password}); 
    const response = await fetch('/api/auth/login', { method: 'POST', body });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message)
    };

    const authHeader = response.headers.get('Authorization');
    const newToken = authHeader?.split(' ')[1];
    if (!newToken) throw new Error('Failed to get token');
    SessionStorage.set(StorageKeys.token, newToken);
}

export async function register(newUser: User): Promise<void> {
  const body = JSON.stringify(newUser); 
  const response = await fetch('/api/auth/register', { method: 'POST', body });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message)
  };
}

export async function logout(newUser: User): Promise<void> {
  const body = JSON.stringify(newUser); 
  const response = await fetchWithError<any>('/api/auth/logout', { method: 'POST', body });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message)
  };
  SessionStorage.remove(StorageKeys.token);
}
  
export async function refreshOnError(error: Error, userId: string){
  if (error.message.trim() === AuthErrors.MISSING_JWT_TOKEN || error.message.trim() === AuthErrors.EXPIRED_TOKEN) {
    const token = await getNewToken({ userId });
    return !!token;
  }
  return false;
}