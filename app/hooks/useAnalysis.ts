import { useState, useEffect } from 'react';
import { getSharedAnalysis } from "@/app/lib/requests/request";

export function useAnalysis(id: string) {
  const [data, setData] = useState({ chartImageUrl: null, analysisResult: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown| Error | null>(null);

  useEffect(() => {
    async function fetchAnalysis(id: string) {
      try {
        const analysis = await getSharedAnalysis(id);
        setData({
          chartImageUrl: analysis.chartUrl,
          analysisResult: analysis.analysis
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis(id);
  }, [id]);

  return { data, loading, error };
}
