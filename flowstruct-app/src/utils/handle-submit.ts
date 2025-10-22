import React from 'react';

export const handleSubmit = <T = Record<string, any>>(
  callback: (values: T, e: React.FormEvent<HTMLFormElement>) => void
) => {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as T;

    callback(values, e);
  };
};
