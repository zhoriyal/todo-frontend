'use client';

import { useSyncExternalStore, useCallback } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('local-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-storage', callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshot = () => {
    return JSON.stringify(initialValue);
  };

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const current = window.localStorage.getItem(key);
        const currentValue = current ? JSON.parse(current) : initialValue;
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue]
  );

  return [JSON.parse(store), setValue];
}