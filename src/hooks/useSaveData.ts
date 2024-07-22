import { useCallback, useRef, useState } from 'react';

interface ApiResponse {
  data: string;
}

export default function useSaveData() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const lastCallId = useRef<number | null>(null);

  const saveData = useCallback(async () => {
    // Cancel previous request by setting a new call ID
    const callId = Date.now();
    lastCallId.current = callId;

    setLoading(true);
    setError(null);
    try {
      const mockApiCall = new Promise<ApiResponse>((resolve) => {
        setTimeout(() => {
          resolve({ data: 'Mocked API response data' });
        }, 5000);
      });

      const result = await mockApiCall;

      // Check if the current call is the last one
      if (lastCallId.current === callId) {
        setData(result);
      }
    } catch (err: unknown) {
      if (lastCallId.current === callId) {
        setError('Failed to fetch data');
      }
    } finally {
      if (lastCallId.current === callId) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, error, saveData, data };
}
