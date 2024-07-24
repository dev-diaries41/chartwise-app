export interface MoreOptionsProps  {
  webhookUrl: string,
  telegramUsername: string,
  handleWebhookUrlChange: (e: any) => void;
  handleTelegramUsernameChange: (e: any) => void;
 }


export type IAnalysis = {
  name: string;
  analyseUrl: string;
}

export interface RecentAnalysesProps {
  analyses: IAnalysis[];
  onClick: (IAnalysis: IAnalysis) => void;
  onDelete: (IAnalysis: IAnalysis) => void;
}


export interface StoredAnalysis {
  analysis: string;
  chartUrl: string;
}