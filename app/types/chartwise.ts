
export type IAnalysisUrl = {
  name: string;
  analyseUrl: string;
}

export interface RecentAnalysesProps {
  analyses: IAnalysisUrl[];
  onClick: (IAnalysisUrl: IAnalysisUrl) => void;
  onDelete: (IAnalysisUrl: IAnalysisUrl) => void;
}

export interface IAnalyse extends AnalysisParams {
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