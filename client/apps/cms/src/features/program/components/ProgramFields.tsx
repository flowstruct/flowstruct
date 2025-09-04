import { Controller, UseFormReturn } from 'react-hook-form';
import { Flex, Select, TextInput } from '@mantine/core';
import { Degree } from '@/features/program/types.ts';
import { GraduationCap, Hash } from 'lucide-react';
import { programSchema } from '@/features/program/schemas.ts';
import { z } from 'zod/v4';

type Props = {
  form: UseFormReturn<z.infer<typeof programSchema>>;
};

export function ProgramFields({ form }: Props) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Flex gap="md">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Code"
              placeholder="eg., MECH, CS, MGT"
              {...field}
              leftSection={<Hash size={18} />}
              error={errors.code?.message}
              autoComplete="off"
              withAsterisk
              w="100%"
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Name"
              {...field}
              placeholder="eg., Computer Science"
              error={errors.name?.message}
              autoComplete="off"
              withAsterisk
              w="100%"
            />
          )}
        />
      </Flex>

      <Controller
        name="degree"
        control={control}
        render={({ field }) => (
          <Select
            label="Degree"
            placeholder="Select a degree"
            {...field}
            data={Object.entries(Degree).map(([key, value]) => ({
              value: key,
              label: `${value} (${key})`,
            }))}
            leftSection={<GraduationCap size={18} />}
            error={errors.degree?.message}
            withAsterisk
          />
        )}
      />
    </>
  );
}
