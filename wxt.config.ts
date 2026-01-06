import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

export default defineConfig({
	vite: () =>
		({
			plugins: [tailwindcss()],
			build: {
				minify: 'terser',
				terserOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['console.log', 'console.info', 'console.debug'],
					},
					format: {
						comments: false,
					},
				},
				rollupOptions: {
					treeshake: {
						moduleSideEffects: false,
						propertyReadSideEffects: false,
						tryCatchDeoptimization: false,
					},
				},
				chunkSizeWarningLimit: 1000,
				sourcemap: false,
				cssCodeSplit: true,
				assetsInlineLimit: 4096,
			},
		}) as any,
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
	modules: [
		'@wxt-dev/webextension-polyfill',
		'@wxt-dev/auto-icons',
		'@wxt-dev/module-react',
	],
	manifest: {
		version: '1.0.68',
		name: 'Widgetify',
		description:
			'Transform your new tab into a smart dashboard with Widgetify! Get currency rates, crypto prices, weather & more.',
		permissions: ['storage', 'search'],
		optional_permissions: ['tabs', 'tabGroups', 'bookmarks', 'identity'],
		browser_specific_settings: {
			gecko: {
				id: 'widgetify@widgetify-app.github.io',
			},
		},
		action: {
			default_title: 'Open Widgetify Dashboard',
			default_icon: {
				16: 'icons/icon16.png',
				32: 'icons/icon32.png',
				48: 'icons/icon48.png',
				128: 'icons/icon128.png',
			},
		},
		host_permissions: [
			'https://github.com/*',
			'https://raw.githubusercontent.com/*',
			'https://api.github.com/*',
			'https://api.widgetify.ir/*',
			'https://www.google-analytics.com/collect*',
			'https://storage.c2.liara.space/*',
		],
		icons: {
			16: 'icons/icon16.png',
			32: 'icons/icon32.png',
			48: 'icons/icon48.png',
			128: 'icons/icon128.png',
		},
	},
})
