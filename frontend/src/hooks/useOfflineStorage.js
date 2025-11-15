import { useState, useEffect, useCallback } from 'react';

// Custom hook for offline data storage and sync
export const useOfflineStorage = (key, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }, [key]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to localStorage
  const saveOffline = useCallback((newData) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData));
      setData(newData);

      // If offline, add to pending sync queue
      if (!isOnline) {
        const syncItem = {
          key,
          data: newData,
          timestamp: Date.now(),
          type: 'update'
        };
        const currentPending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
        currentPending.push(syncItem);
        localStorage.setItem('pendingSync', JSON.stringify(currentPending));
        setPendingSync(currentPending);
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }, [key, isOnline]);

  // Sync pending changes when coming back online
  const syncPendingChanges = useCallback(async (syncFunction) => {
    if (!isOnline || pendingSync.length === 0) return;

    try {
      for (const item of pendingSync) {
        await syncFunction(item.data);
      }

      // Clear pending sync queue
      localStorage.removeItem('pendingSync');
      setPendingSync([]);
    } catch (error) {
      console.error('Error syncing pending changes:', error);
    }
  }, [isOnline, pendingSync]);

  // Clear offline data
  const clearOffline = useCallback(() => {
    try {
      localStorage.removeItem(`offline_${key}`);
      setData(initialData);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, [key, initialData]);

  return {
    data,
    isOnline,
    pendingSync,
    saveOffline,
    syncPendingChanges,
    clearOffline
  };
};

// Hook for managing cached API responses
export const useApiCache = (cacheKey, ttl = 5 * 60 * 1000) => { // 5 minutes default TTL
  const [cache, setCache] = useState({});

  const getCached = useCallback((key) => {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }, [cache, ttl]);

  const setCached = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  const clearCache = useCallback((key) => {
    if (key) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  return {
    getCached,
    setCached,
    clearCache
  };
};
