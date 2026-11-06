import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://elhini.ru',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',
});
