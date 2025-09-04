import { Button } from '@mantine/core';
import { ProgramFields } from '@/features/program/components/ProgramFields.tsx';
import { programSchema } from '@/features/program/schemas.ts';
import { useCreateProgram } from '@/features/program/hooks/useCreateProgram.ts';
import { Link, useNavigate } from '@tanstack/react-router';
import { Plus, X } from 'lucide-react';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { useForm } from 'react-hook-form';
import { customResolver } from '@/utils/customResolver.ts';
import { z } from 'zod/v4';

export function CreateProgramFieldset() {
  const form = useForm<z.infer<typeof programSchema>>({
    resolver: customResolver(programSchema),
    defaultValues: {
      code: '',
      name: '',
    },
  });

  const createProgram = useCreateProgram();
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    createProgram.mutate(data, {
      onSuccess: () => {
        form.reset();
        navigate({
          to: '/catalog/programs',
          search: DefaultSearchValues(),
        });
      },
    });
  });

  const footer = (
    <>
      <Link search={DefaultSearchValues()} to="/catalog/programs">
        <Button variant="default" leftSection={<X size={18} />}>
          Cancel
        </Button>
      </Link>

      <Button
        disabled={!form.formState.isValid}
        type="submit"
        leftSection={<Plus size={18} />}
        loading={createProgram.isPending}
      >
        Save Program
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="Program Details"
        subtitle="Enter the details for the new program"
        footer={footer}
      >
        <ProgramFields form={form} />
      </AppCard>
    </form>
  );
}
