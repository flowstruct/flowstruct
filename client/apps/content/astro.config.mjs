// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],

  env: {
    schema: {
      SITE_TITLE: envField.string({
        context: 'client',
        access: 'public',
        default: 'Flowstruct',
      }),
    },
  },

  server: {
    port: 4321,
    host: true,
  },
});
