
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
  metadata?: {
    strategyAndCriteria?: string;
    risk?: number;
  };
}

export interface IAnalyseCharts {
  chartUrls: string[];
  metadata: {
    strategyAndCriteria?: string;
    risk?: string;
  }
}