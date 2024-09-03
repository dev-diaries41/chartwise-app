import { CHART_ANALYSIS_RESULTS_URL, CHART_ANALYSIS_URL, SAVE_ANALYSIS_URL, FPF_LABS_API_KEY, SHARED_ANALYSIS_URL, JOURNAL_URL, REFRESH_TOKEN_URL, LOGIN_URL, REGISTER_URL, LOGOUT_URL, USAGE_URL } from "@/app/constants/app";
import { IAnalyseCharts, JobReceipt, JobResult, User, StoredAnalysis, TradeJournalEntry, UsagePeriod } from "@/app/types";
import { APIResponse, GetDocsResponse } from "@/app/types/response";
import axios from "axios";

export class ChartWiseAPI {
  private apiKey: string
  public token: string | undefined;

  constructor(apiKey: string){
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'api-key': this.apiKey
    };
  }

  private updateToken(newToken: string | undefined) {
    this.token = newToken;
  }

  public async analyse( analysis:  IAnalyseCharts): Promise<APIResponse<JobReceipt>>{
    const headers = this.getHeaders()
    const reqBody = {data: analysis};
    const response = await axios.post(CHART_ANALYSIS_URL, reqBody, {headers});
    return response.data;
  }

  public async saveAnalysis(analysis: Omit<StoredAnalysis, 'userId'>): Promise<APIResponse<string>> {
    const headers = this.getHeaders();
    const reqBody = {analysis};
    const response = await axios.post(SAVE_ANALYSIS_URL, reqBody, { headers });
    return response.data;
  }
  
  public async getJobResult( jobId: string): Promise<APIResponse<JobResult<{output: string}>>> {
    const headers = this.getHeaders();
    const response = await axios.get(`${CHART_ANALYSIS_RESULTS_URL}/${jobId}`, { headers });
    return response.data;
  }

  public async getSharedAnalysis(id: string):Promise<APIResponse<StoredAnalysis>>{
    const headers = this.getHeaders();
    const response = await axios.get(`${SHARED_ANALYSIS_URL}/${id}`, {headers});
    return response.data;
  }

  public async getJournalEntries(page: string| number, perPage: string| number):Promise<APIResponse<GetDocsResponse<TradeJournalEntry>>>{
    const headers = this.getHeaders();
    const response = await axios.get(`${JOURNAL_URL}`, {headers, params: {page, perPage}});
    return response.data;
  }

  public async addJournalEntry( entry: TradeJournalEntry): Promise<APIResponse<null>>{
    const headers = this.getHeaders();
    const reqBody = {entry};
    const response = await axios.post(JOURNAL_URL, reqBody, {headers});
    return response.data;
  }

  public async getUsage(userId: string, usage: UsagePeriod): Promise<APIResponse<number>> {
    const headers = this.getHeaders();
    const response = await axios.get(`${USAGE_URL}/${usage}/${userId}`, {headers});
    return response.data; 
  };

  public async  getAuthToken(userId: string): Promise<string> {
    const headers = this.getHeaders();
    const reqBody = { userId };
    const response = await axios.post(REFRESH_TOKEN_URL, reqBody, { headers });
    const authHeader = response.headers['authorization'];
    const newToken = authHeader?.split(' ')[1];
    if (!newToken) throw new Error('Failed to get new token');
    this.updateToken(newToken);
    return newToken;
  };

  public async login(email: string, password: string): Promise<string> {
    const headers = this.getHeaders();
    const reqBody = { email, password };
    const response = await axios.post(LOGIN_URL, reqBody, { headers });
    const authHeader = response.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    this.updateToken(token);
    return token;
  };

  public async logout(): Promise<void> {
    const headers = this.getHeaders();
    await axios.post(LOGOUT_URL, {}, { headers });
    this.updateToken(undefined);
  };

  public async register(newUser: User): Promise<void> {
    const headers = this.getHeaders();
    const reqBody = newUser;
    const response = await axios.post(REGISTER_URL, reqBody, { headers });
    return response.data;
  };
}

export const chartwiseAPI = new ChartWiseAPI(FPF_LABS_API_KEY);