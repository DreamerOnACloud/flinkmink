// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  root: './astro', // Add this line to set the default root directory
  integrations: [tailwind()]
});