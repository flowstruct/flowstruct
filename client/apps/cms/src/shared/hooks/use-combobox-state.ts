import { Key } from 'react-aria-components';
import React from 'react';

type UseComboboxStateProps<T extends { id: Key }> = {
  items: Record<Key, T> | null;
  getDisplayName: (item: T) => string;
};

export const useComboBoxState = <T extends { id: Key }>({
  items,
  getDisplayName,
}: UseComboboxStateProps<T>) => {
  const [inputValue, setInputValue] = React.useState('');
  const [selectedKey, setSelectedKey] = React.useState<Key | null>(null);

  const set = React.useCallback((key: Key, value: string) => {
    setSelectedKey(key);
    setInputValue(value);
  }, []);

  const onSelectionChange = React.useCallback(
    (id: Key | null) => {
      if (!items || !id) return;
      const item = items[id];
      if (!item) return;
      set(id, getDisplayName(item));
    },
    [items, getDisplayName, set]
  );

  const onInputChange = React.useCallback((value: string) => {
    setInputValue(value);
    if (value === '') setSelectedKey(null);
  }, []);

  const onCreateItem = React.useCallback(
    (item: T) => set(item.id, getDisplayName(item)),
    [getDisplayName, set]
  );

  const clear = React.useCallback(() => {
    setInputValue('');
    setSelectedKey(null);
  }, []);

  const filteredItems: T[] = React.useMemo(() => {
    if (!items) return [];
    return Object.values(items).filter((item) =>
      getDisplayName(item).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [items, getDisplayName, inputValue]);

  return {
    inputValue,
    selectedKey,
    setInputValue,
    setSelectedKey,
    onInputChange,
    onSelectionChange,
    onCreateItem,
    clear,
    set,
    filteredItems,
  } as const;
};

export type ComboBoxState<T extends { id: Key }> = ReturnType<typeof useComboBoxState<T>>;
