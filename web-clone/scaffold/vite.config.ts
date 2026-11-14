import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { autoImports } from './auto-imports'

const r = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
	plugins: [autoImports, tailwindcss(), react()],
	resolve: {
		alias: {
			'@/common': r('src/common'),
			'@/analytics': r('src/analytics'),
			'@/services': r('src/services'),
			'@/components': r('src/components'),
			'@/context': r('src/context'),
			'@/hooks': r('src/hooks'),
			'@/icons': r('src/icons'),
			'@/styles': r('src/styles'),
			'@/features': r('src/features'),
			'@/pages': r('src/pages'),
			'@/assets': r('src/assets'),
		},
	},
	optimizeDeps: { entries: ['index.html'] },
	define: {
		'import.meta.env.FIREFOX': 'false',
	},
	server: { port: 5188, strictPort: true, fs: { strict: false }, host: '127.0.0.1' },
})
