import { QueueManager } from "qme";
import { logger, metricsLogger } from "@src/logger";
import { LogEntryModel } from "@src/mongo/models/logs";
import { addDoc } from "@src/mongo/utils/add";
import { deleteDocs } from "@src/mongo/utils/delete";
import { getDocs } from "@src/mongo/utils/get";
import { AddDocResponse, DeleteDocsResponse, DeleteLogsOptions, GetDocsResponse, GetLogsOptions, LogEntry, ServiceMetricLog } from "@src/types";
import { getFilter } from "@src/utils/data/queries";

// Add docs is handle by an bullmq for robustness of logging
export async function addLog(newLogJob:{log: LogEntry}): Promise<AddDocResponse>{
    const {log} = newLogJob
      try {
          const result = await addDoc(LogEntryModel, log);
          if(!result.success) throw new Error(result.message)
          return {...result};
      } catch (error: any) {
        logger.error({message: 'Log not added', datails: error.message})
        return { success: false, message: error.message };
      }
  }
  
  
  export async function getLogs(options: GetLogsOptions = {}): Promise<GetDocsResponse<LogEntry>> {
    const { page = 1, perPage = 10 } = options;
    try {
      const filter = getFilter(options) || {};
      return await getDocs(LogEntryModel, filter, page, perPage);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
  
  
  export async function deleteLogs(options: DeleteLogsOptions = {}): Promise<DeleteDocsResponse> {
    try {
      const filter = getFilter(options) || {};
      return await deleteDocs(LogEntryModel, filter);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
  

  async function logMetrics(
    category: string, 
    data: Record<string, any>
  ): Promise<void> {
    try {
      metricsLogger.info(data);
      await addLog({
        log: {
          category,
          formatVersion: 2,
          data,
          timestamp: Date.now(),
        },
      });
    } catch (error: any) {
      logger.error({ message: `Error logging ${category}.`, details: error.message });
    }
  }
  
  export async function logQueueMetrics(jobId: string, chartAnalysisQM: QueueManager): Promise<void> {
    try {
      const parsedJobId = parseInt(jobId, 10);
      const shouldLogQueueMetrics = !isNaN(parsedJobId) && parsedJobId >= 10 && parsedJobId % 10 === 0; // wait till atleast 1- jobs have processed before logging again
      if (!shouldLogQueueMetrics) return;
  
      const completedQueueMetrics = await chartAnalysisQM.queue.getMetrics('completed');
      const failedQueueMetrics = await chartAnalysisQM.queue.getMetrics('failed');
      const queueMetrics = {
        completed: completedQueueMetrics,
        failed: failedQueueMetrics,
      };
  
      await logMetrics('q-metrics', queueMetrics);
    } catch (error: any) {
      logger.error({ message: 'Error logging queue metrics.', details: error.message });
    }
  }
  
  export async function logChartAnalysisMetrics(jobId: string, chartAnalysisQM: QueueManager): Promise<void> {
    const completionTime = await chartAnalysisQM.getJobCompletionTime(jobId);
    if (!completionTime) return;

    const data: ServiceMetricLog = {completionTime, serviceName: chartAnalysisQM.queue.name};
    await logMetrics('metrics', data);
  }
  