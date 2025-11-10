import { useCallback, useEffect, useState } from "react";

interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}

export function useSupabaseQuery<T>(fetcher: () => Promise<QueryResult<T>>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result.data ?? null);
      setError(result.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
