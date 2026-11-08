// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pharmaxports.com',
  // Pages stay static; only routes marked `prerender = false` (the lead API)
  // run as functions. Swap this adapter for @astrojs/cloudflare to move hosts.
  adapter: vercel(),
  // Pages that send `noindex` must not be listed in the sitemap (Search Console flags the conflict).
  integrations: [sitemap({ filter: (page) => !page.includes('/shop/cart/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
