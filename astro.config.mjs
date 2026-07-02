// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import AstroPWA from '@vite-pwa/astro';
import tailwindcss from '@tailwindcss/vite';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'LevelUp — Learning Tracker',
        short_name: 'LevelUp',
        description: 'Track your learning, level up.',
        theme_color: '#0B0F14',
        background_color: '#0B0F14',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{html,js,css,svg,png,ico,woff2,json}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],

  markdown: {
    remarkPlugins: [remarkMermaid, remarkAlert],
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['levelup.aafif.space'],
    },
    preview: {
      allowedHosts: ['levelup.aafif.space'],
    },
  }
});
