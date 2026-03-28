import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { userQueries, userKeys } from '@/features/user/queries';
import { userApi } from '@/features/user/api';
import { TextField } from '@/shared/components/ui/TextField';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuTrigger, MenuItem } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { FormFields } from '@/shared/components/form-fields';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { UserPasswordFormFields } from '@/features/user/components/user-password-form-fields';
import {
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionBody,
  SettingsSectionField,
} from '@/shared/components/settings-section';
import React from 'react';
import { Pencil, X, User, Mail, Save, ChevronLeft } from 'lucide-react';
import styles from './index.module.css';

export const Route = createFileRoute('/_app/settings/')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(siteGeneratorQueries.settings);
    queryClient.ensureQueryData(siteGeneratorQueries.settingsIcon);
    queryClient.ensureQueryData(userQueries.me);
  },
  component: SettingsPage,
});

function SiteGenerationSettings() {
  const { data: settings } = useSuspenseQuery(siteGeneratorQueries.settings);
  const { data: iconBlob } = useSuspenseQuery(siteGeneratorQueries.settingsIcon);

  const iconUrl = React.useMemo(() => {
    return iconBlob ? URL.createObjectURL(iconBlob) : null;
  }, [iconBlob]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateTitle = useMutation({
    mutationFn: (newTitle: string) => siteGeneratorApi.updateTitle(newTitle),
    meta: { successMessage: 'Title updated.' },
  });

  const uploadIcon = useMutation({
    mutationFn: async (file: File) => {
      await siteGeneratorApi.uploadIcon(file);
    },
    onSuccess: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    meta: { successMessage: 'Icon uploaded.' },
  });

  const removeIcon = useMutation({
    mutationFn: () => siteGeneratorApi.removeIcon(),
    meta: { successMessage: 'Icon removed. Using default icon.' },
  });

  const handleTitleBlur = (title: string) => {
    if (title !== settings.title && title.trim()) {
      updateTitle.mutate(title.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadIcon.mutate(file);
    }
  };

  const handleChangeIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveIconClick = () => {
    removeIcon.mutate();
  };

  return (
    <SettingsSection>
      <SettingsSectionHeader>Site generation</SettingsSectionHeader>
      <SettingsSectionBody>
        <SettingsSectionField
          label="Icon"
          description="Upload a PNG file to use as the site icon. Recommended size: 512x512px."
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <MenuTrigger>
            <UnstyledButton className={styles.iconButton}>
              {iconUrl && <img width={50} src={iconUrl} alt="Site icon" />}
              <div className={styles.iconButtonOverlay}>
                <Pencil size={16} />
              </div>
            </UnstyledButton>

            <Popover hideArrow>
              <Menu width={150}>
                <MenuItem onAction={handleChangeIconClick} textValue="change">
                  <Pencil size={14} />
                  Change icon
                </MenuItem>
                {!settings.iconIsDefault && (
                  <MenuItem onAction={handleRemoveIconClick} textValue="remove">
                    <X size={14} />
                    Remove icon
                  </MenuItem>
                )}
              </Menu>
            </Popover>
          </MenuTrigger>
        </SettingsSectionField>

        <SettingsSectionField label="Title">
          <TextField
            width={200}
            name="title"
            aria-label="Site title"
            placeholder="Enter site title"
            defaultValue={settings.title}
            onBlur={(e) => handleTitleBlur(e.target.value)}
          />
        </SettingsSectionField>
      </SettingsSectionBody>
    </SettingsSection>
  );
}

function AccountSettings() {
  const { data: me } = useSuspenseQuery(userQueries.me);
  const queryClient = useQueryClient();

  const editDetails = useMutation({
    mutationFn: userApi.editMyDetails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
    meta: { successMessage: 'Details updated.' },
  });

  const changePassword = useMutation({
    mutationFn: userApi.changeMyPassword,
    meta: { successMessage: 'Password changed.' },
  });

  const handleUsernameBlur = (username: string) => {
    if (username !== me.username && username.trim()) {
      editDetails.mutate({ username: username.trim(), email: me.email });
    }
  };

  const handleEmailBlur = (email: string) => {
    if (email !== me.email && email.trim()) {
      editDetails.mutate({ username: me.username, email: email.trim() });
    }
  };

  const handlePasswordSubmit = (data: Record<string, unknown>) => {
    changePassword.mutate({
      currentPassword: data.currentPassword as string,
      newPassword: data.newPassword as string,
      confirmPassword: data.confirmPassword as string,
    });
  };

  return (
    <SettingsSection>
      <SettingsSectionHeader>Account</SettingsSectionHeader>
      <SettingsSectionBody>
        <SettingsSectionField label="Username">
          <TextField
            width={200}
            name="username"
            aria-label="Username"
            placeholder="Enter username"
            defaultValue={me.username}
            onBlur={(e) => handleUsernameBlur(e.target.value)}
          />
        </SettingsSectionField>

        <SettingsSectionField label="Email">
          <TextField
            width={200}
            name="email"
            aria-label="Email"
            type="email"
            placeholder="Enter email"
            defaultValue={me.email}
            onBlur={(e) => handleEmailBlur(e.target.value)}
          />
        </SettingsSectionField>

        <SettingsSectionField label="Password">
          <FormModal size="sm" onSubmit={handlePasswordSubmit}>
            <FormModalTrigger>
              <Button variant="transparent" size="sm">
                <Pencil size={14} />
                Change password
              </Button>
            </FormModalTrigger>
            <FormModalBody>
              <FormModalHeader>
                <Breadcrumbs>
                  <Breadcrumb base>
                    <User size={15} />
                    {me.username}
                  </Breadcrumb>
                  <Breadcrumb>
                    <Pencil size={15} color="teal" /> Change password
                  </Breadcrumb>
                </Breadcrumbs>
              </FormModalHeader>

              <FormModalContent>
                <FormFields>
                  <UserPasswordFormFields showCurrentPassword />
                </FormFields>
              </FormModalContent>

              <FormModalFooter>
                <FormModalSubmit isPending={changePassword.isPending}>
                  <Save size={15} /> Save
                </FormModalSubmit>
              </FormModalFooter>
            </FormModalBody>
          </FormModal>
        </SettingsSectionField>
      </SettingsSectionBody>
    </SettingsSection>
  );
}

function SettingsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <div className={styles.top}>
          <Link to="/flowsheets" search={{ tab: 'all' }}>
            <Button variant="ghost" size="sm">
              <ChevronLeft size={14} />
              Back to app
            </Button>
          </Link>

          <h1 className={styles.title}>Settings</h1>
        </div>

        <div className={styles.settings}>
          <SiteGenerationSettings />
          <AccountSettings />
        </div>
      </main>
    </div>
  );
}

