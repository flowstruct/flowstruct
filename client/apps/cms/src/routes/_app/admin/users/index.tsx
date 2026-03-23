import { createFileRoute } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userQueries, userKeys } from '@/features/user/queries';
import { useUserTable } from '@/features/user/hooks/use-user-table';
import { Scrollable } from '@/shared/components/scrollable';
import { User, PlusSquare, Plus, Save, Users, UserIcon } from 'lucide-react';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Button } from '@/shared/components/ui/Button';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { userApi } from '@/features/user/api';
import { UserDetailsFormFields } from '@/features/user/components/user-details-form-fields';
import { UserPasswordFormFields } from '@/features/user/components/user-password-form-fields';
import React from 'react';
import { Title } from '@/shared/components/title';
import { FormFields } from '@/shared/components/form-fields';

export const Route = createFileRoute('/_app/admin/users/')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(userQueries.collection);
  },
  component: UsersPage,
});

function UsersPage() {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const { data: currentUser } = useSuspenseQuery(userQueries.me);
  const table = useUserTable({ users: users.list, currentUser });

  return (
    <>
      <Header>
        <HeaderMain>
          <Title>
            <Users size={14} />
            Users
          </Title>
        </HeaderMain>

        <HeaderActions>
          <DataTableToolbar enableSearch table={table} />
          <CreateUserModal />
        </HeaderActions>
      </Header>

      <Scrollable>
        <DataTable table={table} isLoading={false} />
      </Scrollable>
    </>
  );
}

function CreateUserModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const createUser = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      return userApi.createUser({
        username: data.username as string,
        email: data.email as string,
        password: data.newPassword as string,
        confirmPassword: data.confirmPassword as string,
        role: 'GUEST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
    meta: { successMessage: 'User created.' },
  });

  return (
    <FormModal
      size="md"
      open={open}
      onOpenChange={setOpen}
      onSubmit={(data) => createUser.mutate(data)}
    >
      <FormModalTrigger>
        <Button size="sm" variant="transparent">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <Users size={15} /> Users
            </Breadcrumb>

            <Breadcrumb>
              <PlusSquare size={15} color="teal" /> New user
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <FormModalContent>
          <FormFields>
            <UserDetailsFormFields />
            <UserPasswordFormFields />
          </FormFields>
        </FormModalContent>

        <FormModalFooter>
          <FormModalSubmit isPending={createUser.isPending}>
            <UserIcon size={15} /> Create
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalBody>
    </FormModal>
  );
}
