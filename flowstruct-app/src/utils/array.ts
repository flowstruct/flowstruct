
export function appendToSection<T extends { id: string;[key: string]: any }>(
  items: T[],
  sourceId: string,
  section: string,
  sectionKey: keyof T
): T[] {
  const newArr: T[] = [];
  let writeIndex = 0;
  let lastSectionIndex = -1;
  let sourceItem: T | null = null;

  for (let i = 0; i < items.length; i++) {
    const current = items[i];

    if (current.id === sourceId) {
      sourceItem = current;
      continue;
    }

    newArr[writeIndex++] = current;

    if (current[sectionKey] === section) {
      lastSectionIndex = writeIndex - 1;
    }
  }

  if (!sourceItem) return newArr;

  const updatedSourceItem =
    sourceItem[sectionKey] !== section ? { ...sourceItem, [sectionKey]: section } : sourceItem;

  if (lastSectionIndex >= 0) {
    newArr.length = newArr.length + 1;
    for (let i = newArr.length - 1; i > lastSectionIndex + 1; i--) {
      newArr[i] = newArr[i - 1];
    }
    newArr[lastSectionIndex + 1] = updatedSourceItem;
  } else {
    newArr[writeIndex] = updatedSourceItem;
  }

  return newArr;
}
