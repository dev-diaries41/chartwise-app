import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { DefaultToastOptions, StorageKeys, Time } from '@/app/constants/app';
import { DEFAULT_ERROR_MESSAGE, JobErrors } from '../constants/errors';
import { getJobStatus } from '../lib/requests/chartwise-client';
import * as Storage from '@/app/lib/storage/local'
import usePolling from './usePolling';

const useJobPolling = (setChartAnalysisResult: any, setLoading: any) => {
  const onJobComplete = useCallback((chartAnalysis: string) => {
    stopPolling();
    setChartAnalysisResult(chartAnalysis);
    Storage.remove(StorageKeys.jobId);
    setLoading(false);
  }, [setChartAnalysisResult, setLoading]);

  const onJobFail = useCallback(() => {
    stopPolling();
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
    setLoading(false);
  }, [setLoading]);

  const pollJobStatus = useCallback(async () => {
    try {
      const jobId = Storage.get<string>(StorageKeys.jobId);
      if (!jobId) throw new Error(JobErrors.INVALID_JOB_ID);

      const { data, status } = await getJobStatus(jobId);

      if (status === 'completed') {
        onJobComplete(data.output);
      } else if (status === 'failed') {
        onJobFail();
      }
    } catch (error) {
      toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
      setLoading(false);
      throw error;
    }
  }, [onJobComplete, onJobFail, setLoading]);

  const pollOptions = {
    interval: 5 * Time.sec,
    maxDuration: Time.min,
    maxErrors: 3,
    onMaxDuration: () => setLoading(false),
    onMaxErrors: () => setLoading(false),
  };

  const { startPolling, stopPolling } = usePolling(pollJobStatus, pollOptions);

  return { startPolling, stopPolling };
};

export default useJobPolling;
