import { QueueManager } from "@src/bullmq/queues";
import { logger, metricsLogger } from "@src/logger";
import { LogEntryModel } from "@src/mongo/models/logs";
import { addDoc } from "@src/mongo/utils/add";
import { deleteDocs } from "@src/mongo/utils/delete";
import { getDocs } from "@src/mongo/utils/get";
import { AddDocResponse, DeleteDocsResponse, DeleteLogsOptions, GetDocsResponse, GetLogsOptions, LogEntry, MetricLog } from "@src/types";
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
  

  function logMetrics(logData: MetricLog){
    metricsLogger.info(logData);
}

export async function logChartAnalysisMetrics(jobId: string, chartAnalysisQM: QueueManager): Promise<void>{
    const completionTime = await chartAnalysisQM.getJobCompletionTime(jobId);
    if(completionTime){
        const data = {completionTime, serviceName: chartAnalysisQM.queue.name}
        logMetrics(data);
        await addLog({
            log: {
                category: 'metrics',
                formatVersion: 1,
                data: data,
                timestamp: Date.now(),
            }
        })
    }
}