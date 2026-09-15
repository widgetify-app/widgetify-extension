import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

function amoSanitizeReactDomInnerHtml(): Plugin {
	return {
		name: 'amo-sanitize-react-dom-innerhtml',
		enforce: 'post',
		generateBundle(_options, bundle) {
			for (const fileName of Object.keys(bundle)) {
				const chunk = bundle[fileName]
				if (chunk.type === 'chunk' && chunk.code.includes('.innerHTML')) {
					chunk.code = chunk.code.replace(
						/([a-zA-Z0-9_$]+)\.innerHTML\s*=/g,
						"$1['innerHTML']="
					)
				}
			}
		},
	}
}

export default defineConfig({
	vite: (configEnv) => ({
		plugins: [
			tailwindcss(),
			...(configEnv.browser === 'firefox' ? [amoSanitizeReactDomInnerHtml()] : []),
		],

		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
					pure_funcs: ['console.log', 'console.info', 'console.debug'],
				},
				format: { comments: false },
			},
			rollupOptions: {
				treeshake: { propertyReadSideEffects: false },
			},
			chunkSizeWarningLimit: 1000,
			sourcemap: false,
			cssCodeSplit: true,
			assetsInlineLimit: 4096,
		},
	}),

	alias: {
		'@/common': './src/common',
		'@/analytics': './src/analytics',
		'@/services': './src/services',
		'@/components': './src/components',
		'@/context': './src/context',
		'@/hooks': './src/hooks',
		'@/icons': './src/icons',
		'@/styles': './src/styles',
		'@/layouts': './src/layouts',
		'@/pages': './src/pages',
		'@/assets': './src/assets',
	},

	modules: [
		'@wxt-dev/webextension-polyfill',
		'@wxt-dev/auto-icons',
		'@wxt-dev/module-react',
	],

	manifest: ({ browser }) => {
		const isFirefox = browser === 'firefox'
		const rawVersion = process.env.FIREFOX_EXTENSION_VERSION?.trim()
		const version = (rawVersion ? rawVersion.replace(/^[vV]/, '') : '') || '1.1.3'
		const geckoId =
			process.env.FIREFOX_EXTENSION_ID?.trim() || 'widgetify_ir@addons.mozilla.org'
		return {
			version,
			name: 'Widgetify',
			description:
				'Transform your new tab into a smart dashboard with Widgetify! Get currency rates, crypto prices, weather & more.',

			permissions: ['storage', 'search', ...(isFirefox ? ['identity'] : [])],

			optional_permissions: [
				'tabs',
				'tabGroups',
				'bookmarks',
				...(!isFirefox ? ['identity'] : []),
			],

			browser_specific_settings: {
				gecko: {
					id: geckoId,
					strict_min_version: '142.0',
					data_collection_permissions: {
						required: ['none'],
						optional: ['technicalAndInteraction', 'websiteActivity'],
					},
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
		}
	},
})
