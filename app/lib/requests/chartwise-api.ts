import { CHART_ANALYSIS_RESULTS_URL, CHART_ANALYSIS_URL, SAVE_ANALYSIS_URL, FPF_LABS_API_KEY, SHARED_ANALYSIS_URL } from "@/app/constants/app";
import { JobReceipt, JobResult, StoredAnalysis } from "@/app/types";
import { ChartWiseAPIResponse } from "@/app/types/response";
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

  private updateToken(newToken: string) {
    this.token = newToken;
  }

  public async analyse( image:string, strategyAndCriteria: string | null, risk: string | null): Promise<ChartWiseAPIResponse<JobReceipt>>{
    const headers = this.getHeaders()
    const reqBody = {when: Date.now(), jobData: {image, strategyAndCriteria, risk}}
    const response = await axios.post(CHART_ANALYSIS_URL, reqBody, {headers});
    const {message, data} = response.data
    const newToken = response.headers['authorization']?.split(' ')[1];
    this.updateToken(newToken)
    return {message, data, token: newToken};
  }

  public async saveAnalysis(chart: string, analysis: string): Promise<ChartWiseAPIResponse<string>> {
    const headers = this.getHeaders()
    const reqBody = { chart, analysis };
    const response = await axios.post(SAVE_ANALYSIS_URL, reqBody, { headers });
    const { message, data } = response.data;
    const newToken = response.headers['authorization']?.split(' ')[1];
    this.updateToken(newToken)
    return { message, data, token: newToken };
  }
  
  public async getJobResult( jobId: string): Promise<ChartWiseAPIResponse<JobResult<{output: string}>>> {
    const headers = this.getHeaders();
    const response = await axios.get(`${CHART_ANALYSIS_RESULTS_URL}/${jobId}`, { headers });
    const { message, data } = response.data as ChartWiseAPIResponse<JobResult<{output: string}>>;
    const newToken = response.headers['authorization']?.split(' ')[1];
    this.updateToken(newToken)
    return { message, data, token: newToken };
  }

  public async getSharedAnalysis(id: string):Promise<ChartWiseAPIResponse<StoredAnalysis>>{
    const headers = this.getHeaders();
    const response = await axios.get(`${SHARED_ANALYSIS_URL}/${id}`, {headers});
    const {data} = response.data;
    return { data };
  }
}

export const chartwiseAPI = new ChartWiseAPI(FPF_LABS_API_KEY);
