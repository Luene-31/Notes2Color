import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages（プロジェクトサイト）: リポジトリ名と一致
const repo = 'Note2Color'

export default defineConfig({
  base: `/${repo}/`,
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
