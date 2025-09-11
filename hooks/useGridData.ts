import { useState, useEffect, useCallback, useRef } from 'react';
import { UseGridDataReturn, GridApiResponse } from '../types/grid.types';
import { gridDataService } from '../lib/gridDataService';

const UPDATE_INTERVAL = parseInt(process.env.NEXT_PUBLIC_GRID_UPDATE_INTERVAL || '60000', 10);

export function useGridData(autoUpdate: boolean = true): UseGridDataReturn {
  const [gridData, setGridData] = useState<GridApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    console.log('useGridData: Starting to fetch data...');
    try {
      setError(null);
      const data = await gridDataService.getGridData();
      
      console.log('useGridData: Data fetched successfully:', data);
      console.log('useGridData: mountedRef.current:', mountedRef.current);
      if (mountedRef.current) {
        console.log('useGridData: Setting state - gridData:', data);
        setGridData(data);
        console.log('useGridData: Setting state - lastUpdated');
        setLastUpdated(new Date());
        console.log('useGridData: Setting state - isLoading: false');
        setIsLoading(false);
        console.log('useGridData: State updated, loading complete');
      } else {
        console.log('useGridData: Component unmounted, not setting state');
      }
    } catch (err) {
      console.error('useGridData: Error fetching grid data:', err);
      
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch grid data');
        setIsLoading(false);
        console.log('useGridData: Error state set, loading complete');
      }
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await fetchData();
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-update interval
  useEffect(() => {
    if (!autoUpdate) return;

    intervalRef.current = setInterval(() => {
      if (mountedRef.current && !isLoading) {
        fetchData();
      }
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoUpdate, fetchData, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    console.log('useGridData: Component mounted, setting mountedRef to true');
    return () => {
      console.log('useGridData: Component unmounting, setting mountedRef to false');
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    gridData,
    isLoading,
    error,
    refetch,
    lastUpdated,
  };
}