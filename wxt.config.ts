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
					// WXT builds with rolldown, whose treeshake options are a
					// subset of Rollup's: annotations, commonjs,
					// manualPureFunctions, moduleSideEffects,
					// propertyReadSideEffects, unknownGlobalSideEffects.
					// `tryCatchDeoptimization` is Rollup-only and was rejected
					// with "Expected never but received ..." on every build.
					//
					// `moduleSideEffects: false` is deliberately NOT set. It
					// asserts that no module anywhere has side effects, which
					// overrides the conservative default for the many deps that
					// declare no `sideEffects` field of their own — including
					// @wxt-dev/webextension-polyfill (a polyfill is *entirely*
					// side effect), the workbox packages that register routes,
					// and react-ga4. Measured on this project it saved 205 bytes
					// of JS+CSS out of ~2.46 MB (0.008%), which does not come
					// close to justifying that class of silent breakage.
					treeshake: {
						propertyReadSideEffects: false,
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
		'@/styles': './src/styles',
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
		version: '1.2.1',
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
