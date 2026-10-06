import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const sentryUploadEnabled = Boolean(
    env.VITE_SENTRY_ENABLED === 'true'
    && env.SENTRY_AUTH_TOKEN
    && env.SENTRY_ORG
    && env.SENTRY_PROJECT
    && env.VITE_SENTRY_RELEASE,
  )

  const plugins = [react(), tailwindcss()]

  if (sentryUploadEnabled) {
    plugins.push(
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        telemetry: false,
        release: {
          name: env.VITE_SENTRY_RELEASE,
        },
        sourcemaps: {
          assets: './dist/**',
          filesToDeleteAfterUpload: './dist/**/*.map',
        },
      }),
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        // Las peticiones a /api se proxean al backend para evitar CORS en desarrollo.
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      sourcemap: sentryUploadEnabled ? 'hidden' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'data-vendor': ['@tanstack/react-query'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['cmdk', 'lucide-react', 'radix-ui'],
          },
        },
      },
    },
  }
})
