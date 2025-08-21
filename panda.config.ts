import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  presets: ['@pandacss/preset-base'],
  include: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  jsxFramework: 'react',
  outdir: 'styled-system',
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: '#ff6b35' },
          secondary: { value: '#f7931e' },
          accent: { value: '#ff8a65' },
          success: { value: '#4caf50' },
          warning: { value: '#ff9800' },
          error: { value: '#f44336' },
        }
      }
    }
  }
})
