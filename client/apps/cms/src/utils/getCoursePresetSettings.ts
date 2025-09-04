import { Course } from '@/features/course/types.ts';
import { PresetType } from '@/features/course/hooks/useCoursePreset.ts';

export const getCoursePresetSettings = (preset: PresetType) => {
  const fields: Pick<Course, 'creditHours' | 'lectureHours' | 'practicalHours' | 'type'> = {
    creditHours: 0,
    lectureHours: 0,
    practicalHours: 0,
    type: 'F2F',
  };

  switch (preset) {
    case 'lecture':
      return { creditHours: 3, lectureHours: 3, practicalHours: 0, type: 'F2F' };
    case 'lab':
      return { creditHours: 1, lectureHours: 0, practicalHours: 3, type: 'BLD' };
    case 'custom':
      return fields;
  }
};
