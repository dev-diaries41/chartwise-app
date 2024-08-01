import { StorageKeys } from "@/app/constants/app";
import { AuthErrors, JobErrors } from "../../constants/errors";
import {SessionStorage} from "@/app/lib/storage"
import {JobReceipt, JobResult, StoredAnalysis, Usage, UsagePeriod} from "@/app/types"
import { validateAnalysis } from "../validation";

 function getAuthHeaders (){
    const currentToken = SessionStorage.get<string>(StorageKeys.token);
    if (!currentToken || typeof currentToken !=='string' ) throw new Error(AuthErrors.MISSING_JWT_TOKEN);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${currentToken}`);
    return headers;
  }; 

  async function fetchWithJWT<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpointUrl, options);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
  
    const newToken = response.headers.get('Authorization')?.split(' ')[1];
    if (newToken) SessionStorage.set(StorageKeys.token, newToken);
    return await response.json();
  }

  export async function getNewToken({ userId }: { userId: string}): Promise<string> {
      if (!userId) throw new Error(AuthErrors.INVALID_USER_ID);
  
      const formData = new FormData();
      formData.append('userId', userId);
    
      const response = await fetch('/api/auth/token', { method: 'POST', body: formData });
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
    const endpointUrl = `/api/analysis/results?jobId=${jobId}`;
    const headers = getAuthHeaders();
    const  {data} = await fetchWithJWT<{data: JobResult<{ output: string }>}>(endpointUrl, { method: 'GET', headers });
    return data;
  }
  
  export async function submitAnalysisRequest(formData: FormData): Promise<string> {
    const endpointUrl = '/api/analysis';
    const headers = getAuthHeaders();
    const {data} = await fetchWithJWT<{data: JobReceipt}>(endpointUrl, { method: 'POST', body: formData, headers });
    if (!data?.jobId) throw new Error(JobErrors.INVALID_JOB_ID);
    return data.jobId;
  }
  
  export async function getUsage(userId: string | null | undefined, period: UsagePeriod): Promise<number> {
    if (!userId) return 0
    const endpointUrl = `/api/usage/${period}?userId=${userId}`;
    const { data } = await fetchWithJWT<{data: number}>(endpointUrl, { method: 'GET' });
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
  export async function saveAnalysis (analysis: Omit<StoredAnalysis, 'userId'>): Promise<string | null> {
    try {
      const headers = getAuthHeaders();
      const formData = new FormData();
      const results = validateAnalysis(analysis)
      if(!results.success)throw new Error(JSON.stringify(results.error))
      formData.append('analysis', JSON.stringify(results.data));
      const response = await fetch('/api/analysis/save', {method: 'POST',body: formData, headers});
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message)
      };
      
      const {data} = await response.json() as {data: string};
      const id = data;
      const shareableUrl = `${window.location.origin}/share/${id}`;
      return shareableUrl;
    } catch (error) {
      return null;
    }
  };

  export async function getSharedAnalysis (id: string): Promise<StoredAnalysis> {
      const endpointUrl = `/api/analysis/share?id=${id}`;
      const response = await fetch(endpointUrl, { method: 'GET' });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message)
      };

      const {data} = await response.json() as {data: StoredAnalysis};
      return data;
  };

  export async function refreshOnError(error: Error, userId: string){
    if (error.message.trim() === AuthErrors.MISSING_JWT_TOKEN || error.message.trim() === AuthErrors.EXPIRED_TOKEN) {
      const token = await getNewToken({ userId });
      return !!token;
    }
    return false;
  }
  