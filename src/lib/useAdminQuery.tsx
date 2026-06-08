'use client';

import { useEffect, useRef, useState } from 'react';

export function useAdminQuery<T>(load: () => Promise<T>, key: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const loadRef = useRef(load);
  const keyString = JSON.stringify(key);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    loadRef.current()
      .then(result => {
        if (!alive) return;
        setData(result);
      })
      .catch(err => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : 'Request failed');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [keyString]);

  return { data, error, loading, setData };
}

export function ApiState({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) {
    return <div className="empty"><div className="muted">Loading live backend data...</div></div>;
  }
  if (error) {
    return <div className="empty"><div className="muted">Backend error: {error}</div></div>;
  }
  return null;
}
