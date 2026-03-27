import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { TextField } from '@/shared/components/ui/TextField';
import React from 'react';
import { siteGeneratorApi as api } from '@/features/site-generator/api';
import styles from './index.module.css';
import { Menu, MenuTrigger } from '@/shared/components/ui/Menu';
import logo from '@/assets/logo.png';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';

export const Route = createFileRoute('/_app/settings/')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(siteGeneratorQueries.settings);
  },
  component: SiteGenerationSettingsPage,
});

function SiteGenerationSettingsPage() {
  const { data: settings } = useSuspenseQuery(siteGeneratorQueries.settings);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateTitle = useMutation({
    mutationFn: (newTitle: string) => siteGeneratorApi.updateTitle(newTitle),
    meta: { successMessage: 'Title updated.' },
  });

  const uploadIcon = useMutation({
    mutationFn: async (file: File) => {
      await api.uploadIcon(file);
    },
    onSuccess: () => {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    meta: { successMessage: 'Icon uploaded.' },
  });

  const handleTitleBlur = (title: string) => {
    console.log(title);
    if (title !== settings.title && title.trim()) {
      updateTitle.mutate(title.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      uploadIcon.mutate(selectedFile);
    }
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

              <Menu>
                <MenuTrigger>
                  <UnstyledButton>
                    <img src={logo} />
                  </UnstyledButton>
                </MenuTrigger>
              </Menu>
            </div>
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

        {/* <div> */}
        {/*   <h2 className="text-lg font-semibold mb-4">Icon</h2> */}
        {/*   <div className="flex items-center gap-4"> */}
        {/*     <input */}
        {/*       ref={fileInputRef} */}
        {/*       type="file" */}
        {/*       accept="image/png" */}
        {/*       onChange={handleFileChange} */}
        {/*       className="text-sm" */}
        {/*     /> */}
        {/*     <Button */}
        {/*       size="sm" */}
        {/*       variant="default" */}
        {/*       onPress={handleUploadClick} */}
        {/*       isDisabled={!selectedFile} */}
        {/*     > */}
        {/*       Upload Icon */}
        {/*     </Button> */}
        {/*   </div> */}
        {/*   <p className="text-xs text-gray-500 mt-2"> */}
        {/*     Upload a PNG file to use as the site icon. Recommended size: 512x512px. */}
        {/*   </p> */}
        {/* </div> */}
      </main>
    </div>
  );
}
