import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  envPrefix: ['VITE_', ''], // 允許無前綴的環境變數（如 GITHUB_TOKEN）
});