interface IBaseAnalysis {
  chartUrls: string[];
  metadata?: {
    strategyAndCriteria?: string;
    risk?: string;
    [key: string]: any; 
  };
}


export interface IAnalyseCharts extends Omit<IBaseAnalysis, 'chartUrl'> {
}

export interface Analysis extends IBaseAnalysis {
  analysis: string;
  userId: string;
  formatVersion?: number;
}

export interface ITradeJournalEntry {
  entryId: number;
  userId: string;
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



export interface LogEntry {
    category: string;
    formatVersion: number;
    timestamp: number;
    userId?: string;
    data: Record<string,any>;
    metadata?: Record<string, any>;
}

export interface BaseFilterOptions {
    category?: string;               // Filter by category
    filterDate?: string | number;   // Single date filter (for backward compatibility)
    startDate?: string | number;    // Start date for date range filter
    endDate?: string | number;      // End date for date range filter
  }

export interface GetLogsOptions extends BaseFilterOptions {
    page?: string | number;         
    perPage?: string | number; 
  }
  

export interface DeleteLogsOptions extends BaseFilterOptions {}

export type MetricLog = {
  completionTime: number;
  serviceName: string;
}