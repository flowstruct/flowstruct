import {
  Center,
  Checkbox,
  Group,
  NumberInput,
  Radio,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Controller, UseFormReturn } from 'react-hook-form';
import { CourseType } from '@/features/course/types.ts';
import {
  BookOpenText,
  Earth,
  FlaskConical,
  GraduationCap,
  Hash,
  Settings2,
  Timer,
} from 'lucide-react';
import { PresetType } from '@/features/course/hooks/useCoursePreset.ts';
import { z } from 'zod/v4';
import { courseSchema } from '@/features/course/schemas.ts';

type Props = {
  form: UseFormReturn<z.infer<typeof courseSchema>>;
  preset: PresetType;
  changePreset: (value: PresetType) => void;
};

export function CourseFields({ form, preset, changePreset }: Props) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Stack>
      <Group wrap="nowrap">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextInput
              data-autofocus
              w="25%"
              label="Code"
              leftSection={<Hash size={18} />}
              {...field}
              error={errors.code?.message}
              autoComplete="off"
              withAsterisk
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              flex={1}
              label="Name"
              {...field}
              error={errors.name?.message}
              autoComplete="off"
              withAsterisk
            />
          )}
        />
      </Group>

      <div>
        <Text size="sm" fw={500} mb={3}>
          Presets
        </Text>
        <Text></Text>
        <SegmentedControl
          value={preset}
          onChange={changePreset as (value: string) => void}
          withItemsBorders={false}
          fullWidth
          data={[
            {
              value: 'lecture',
              label: (
                <Center style={{ gap: 10 }}>
                  <BookOpenText size={16} />
                  <span>Lecture</span>
                </Center>
              ),
            },
            {
              value: 'lab',
              label: (
                <Center style={{ gap: 10 }}>
                  <FlaskConical size={16} />
                  <span>Lab</span>
                </Center>
              ),
            },
            {
              value: 'custom',
              label: (
                <Center style={{ gap: 10 }}>
                  <Settings2 size={16} />
                  <span>Custom</span>
                </Center>
              ),
            },
          ]}
        />
      </div>

      <Group wrap="nowrap">
        <Controller
          name="creditHours"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Credit Hours"
              {...field}
              error={errors.creditHours?.message}
              autoComplete="off"
              leftSection={<GraduationCap size={18} />}
              withAsterisk
              allowNegative={false}
              suffix=" Cr."
              flex={1}
            />
          )}
        />

        <Controller
          name="ects"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="ECTS"
              {...field}
              error={errors.ects?.message}
              autoComplete="off"
              leftSection={<Earth size={18} />}
              allowNegative={false}
              suffix=" ECTS"
              flex={1}
            />
          )}
        />
      </Group>

      <Group wrap="nowrap">
        <Controller
          name="lectureHours"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Lecture Hours"
              {...field}
              error={errors.lectureHours?.message}
              autoComplete="off"
              withAsterisk
              leftSection={<Timer size={18} />}
              allowNegative={false}
              suffix=" Hrs/Week"
              flex={1}
            />
          )}
        />

        <Controller
          name="practicalHours"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Practical Hours"
              {...field}
              error={errors.practicalHours?.message}
              autoComplete="off"
              withAsterisk
              leftSection={<Timer size={18} />}
              allowNegative={false}
              suffix=" Hrs/Week"
              flex={1}
            />
          )}
        />
      </Group>

      <Group gap="md">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Radio.Group
              {...field}
              label="Teaching Method"
              withAsterisk
              error={errors.type?.message}
              flex={1}
            >
              <Group mt="xs">
                {Object.entries(CourseType).map(([key, value]) => (
                  <Radio key={key} value={key} label={`${key}: ${value}`} />
                ))}
              </Group>
            </Radio.Group>
          )}
        />

        <Controller
          name="isRemedial"
          control={control}
          render={({ field }) => (
            <Checkbox
              mt="xs"
              {...{ ...field, value: undefined }}
              checked={field.value}
              label="Remedial Course"
              description={
                field.value
                  ? 'This course will be ignored as a prerequisite'
                  : 'This course will count as a prerequisite'
              }
              flex={1}
            />
          )}
        />
      </Group>
    </Stack>
  );
}
