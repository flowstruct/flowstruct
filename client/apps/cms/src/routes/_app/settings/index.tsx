import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { TextField } from '@/shared/components/ui/TextField';
import React from 'react';
import styles from './index.module.css';
import { Menu, MenuTrigger, MenuItem } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Pencil, X } from 'lucide-react';

export const Route = createFileRoute('/_app/settings/')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(siteGeneratorQueries.settings);
    queryClient.ensureQueryData(siteGeneratorQueries.settingsIcon);
  },
  component: SiteGenerationSettingsPage,
});

function SiteGenerationSettingsPage() {
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
    <div className={styles.page}>
      <main className={styles.content}>
        <h1 className={styles.title}>Settings</h1>
        <h2 className={styles.settingsSectionHeader}>Site generation</h2>

        <section className={styles.settingsSection}>
          <div className={styles.settingsField}>
            <div className={styles.settingsFieldLabelContainer}>
              <p className={styles.settingsFieldLabel}>Icon</p>
              <p className={styles.settingsFieldDescription}>
                Upload a PNG file to use as the site icon. Recommended size: 512x512px.
              </p>
            </div>

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
          </div>

          <div className={styles.settingsField}>
            <p className={styles.settingsFieldLabel}>Title</p>
            <TextField
              width={200}
              name="title"
              aria-label="Site title"
              placeholder="Enter site title"
              defaultValue={settings.title}
              onBlur={(e) => handleTitleBlur(e.target.value)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
