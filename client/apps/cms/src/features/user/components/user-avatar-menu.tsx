import { userApi } from '@/features/user/api';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function UserAvatarMenu({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      queryClient.cancelQueries();
      navigate({ to: '/login', search: { redirect: '/' } });
    },
    meta: {
      invalidate: false,
    },
  });

  return (
    <MenuTrigger>
      {children}
      <Popover hideArrow>
        <Menu width={200}>
          <MenuItem onPress={() => logout.mutate()} textValue="logout">
            <LogOut size={14} />
            <span>Log out</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
