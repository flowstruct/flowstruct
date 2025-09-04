import { getCoursePresetSettings } from '@/utils/getCoursePresetSettings.ts';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import { courseSchema } from '@/features/course/schemas.ts';

export type PresetType = 'lecture' | 'lab' | 'custom';

const presetSchema = courseSchema.pick({
  creditHours: true,
  lectureHours: true,
  practicalHours: true,
  type: true,
});

export const useCoursePreset = (form: UseFormReturn<z.infer<typeof courseSchema>>) => {
  const [preset, setPreset] = React.useState<PresetType>('lecture');

  const changePreset = (preset: PresetType) => {
    setPreset(preset);
    form.reset((prevValues) => ({
      ...prevValues,
      ...getCoursePresetSettings(preset),
    }));
  };

  React.useEffect(() => {
    const subscription = form.watch((_, { name, type }) => {
      if (type !== 'change' || !name) return;

      const presetFields = Object.keys(presetSchema.def.shape);

      const presetFieldsModified = presetFields.includes(name);
      if (presetFieldsModified) setPreset('custom');
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  return { preset, changePreset };
};
