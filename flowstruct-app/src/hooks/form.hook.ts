import { type Dispatch, type SetStateAction, useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialData: T): FormReturnResult<T> => {
  const [data, setData] = useState<T>(initialData);

  const updateData = <K extends keyof T>(key: K, value: T[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setData(initialData);
  };

  return { data, setData, updateData, reset };
};

export type FormReturnResult<T> = {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  updateData: <K extends keyof T>(key: K, value: T[K]) => void;
  reset: () => void;
};
