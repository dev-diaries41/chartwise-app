
export type IAnalysisUrl = {
  name: string;
  analyseUrl: string;
}

export interface RecentAnalysesProps {
  analyses: IAnalysisUrl[];
  onClick: (IAnalysisUrl: IAnalysisUrl) => void;
  onDelete: (IAnalysisUrl: IAnalysisUrl) => void;
}

export interface IAnalysis extends AnalysisParams {
  output: string ;
  userId: string;
  formatVersion?: number;
}

export interface AnalysisParams {
  chartUrls: string[];
  metadata: {
    strategyAndCriteria?: string;
    risk?: number;
  }
}

export interface TradeJournalEntry {
  entryId: number;
  tradeDate: Date;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  comments?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}

export type OnboardingAnswers = {
  tradingAssets?: string[]; 
  tradingExperience?: string[];         
  analysisMethods?: string[];          
  tradingGoals?: string[];             
}