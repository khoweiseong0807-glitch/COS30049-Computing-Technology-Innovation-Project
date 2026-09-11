import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const githubPagesBase = '/COS30049-Computing-Technology-Innovation-Project/'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : '/',
})
