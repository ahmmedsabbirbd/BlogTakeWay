import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Determine which entry point to build based on command line argument
const buildTarget = process.env.BUILD_TARGET || 'chat-widget'

const entryPoint = buildTarget === 'chat-admin'
    ? path.resolve(__dirname, 'src/admin/index.jsx')
    : path.resolve(__dirname, 'src/index.jsx')

export default defineConfig({
    plugins: [react()],
    build: {
        sourcemap: true,
        outDir: 'build',
        emptyOutDir: false,
        cssCodeSplit: false,
        rollupOptions: {
            input: entryPoint,
            output: {
                format: 'iife',
                entryFileNames: `${buildTarget}.js`,
                chunkFileNames: 'chunks/[name].[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return `${buildTarget}.css`
                    }
                    return 'assets/[name].[hash][extname]'
                },
                globals: {
                    '@wordpress/i18n': 'wp.i18n'
                }
            },
            external: [
                '@wordpress/i18n'
            ],
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    }
})