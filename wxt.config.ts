import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'wxt'

export default defineConfig({
	//@ts-ignore
	vite(env) {
		return {
			plugins: [tailwindcss(), react()],
		}
	},
	alias: {
		'@/common': './src/common',
		'@/analytics': './src/analytics',
		'@/services': './src/services',
		'@/components': './src/components',
		'@/context': './src/context',
		'@/hooks': './src/hooks',
		'@/utils': './src/utils',
		'@/layouts': './src/layouts',
		'@/pages': './src/pages',
		'@/assets': './src/assets',
	},
	modules: ['@wxt-dev/webextension-polyfill', '@wxt-dev/auto-icons'],
	manifest: {
		version: '1.0.10',
		name: 'Widgetify',
		description:
			'Transform your new tab into a smart dashboard with Widgetify! Get currency rates, crypto prices, weather & more.',
		permissions: ['storage', 'search'],
		browser_specific_settings: {
			gecko: {
				id: 'widgetify@widgetify-app.github.io',
			},
		},
		icons: {
			16: 'icons/icon16.png',
			32: 'icons/icon32.png',
			48: 'icons/icon48.png',
			128: 'icons/icon128.png',
		},
	},
})
