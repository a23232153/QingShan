import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// 加載 .env 文件
dotenv.config();

export default defineConfig({
  plugins: [sveltekit(),tailwindcss()],
  define: {
    'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN)
  }
});


