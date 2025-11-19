import React from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);

      if (!item) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      return JSON.parse(item);
    } catch (e) {
      console.log(e);
      return initialValue;
    }
  });

  const setValue = (newValue: T | ((prev: T) => T)) => {
    const value =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(storedValue) : newValue;

    try {
      setStoredValue(value);

      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return [storedValue, setValue] as const;
};
