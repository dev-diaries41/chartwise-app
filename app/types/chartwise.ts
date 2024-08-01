export interface MoreOptionsProps  {
  webhookUrl: string,
  telegramUsername: string,
  handleWebhookUrlChange: (e: any) => void;
  handleTelegramUsernameChange: (e: any) => void;
 }


export type IAnalysisUrl = {
  name: string;
  analyseUrl: string;
}

export interface RecentAnalysesProps {
  analyses: IAnalysisUrl[];
  onClick: (IAnalysisUrl: IAnalysisUrl) => void;
  onDelete: (IAnalysisUrl: IAnalysisUrl) => void;
}


export interface StoredAnalysis {
  analysis: string ;
  chartUrls: string[];
  userId: string;
  formatVersion?: number;
  metadata?: Record<string, any>;
}

export interface IAnalyseCharts {
  chartUrls: string[];
  metadata: {
    strategyAndCriteria?: string;
    risk?: string;
  }
}