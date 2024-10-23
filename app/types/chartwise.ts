
export type IAnalysisUrl = {
  name: string;
  analyseUrl: string;
}

export interface RecentAnalysesProps {
  analyses: IAnalysisUrl[];
  onDelete: (IAnalysisUrl: IAnalysisUrl) => void;
}

export interface IAnalysis extends AnalysisParams {
  output: string ;
  timestamp?: number;
  userId: string;
  formatVersion?: number;
  name: string;
}

export interface AnalysisParams {
  chartUrls: string[];
  metadata: {
    strategyAndCriteria?: string;
    risk?: number;
  }
}

export interface TradeJournalEntry {
  entryId: string;
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
  userId: string
}

export type OnboardingAnswers = {
  tradingAssets?: string[]; 
  tradingExperience?: string[];         
  analysisMethods?: string[];          
  tradingGoals?: string[];             
}