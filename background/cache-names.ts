import { CacheName } from '@/common/types/sw-events'

export const CACHE_PREFIX = 'wgf-'

export const APP_VERSION: string = (() => {
	try {
		return browser.runtime.getManifest().version
	} catch {
		return '0'
	}
})()

const ns = (base: string) => `${CACHE_PREFIX}${base}-v${APP_VERSION}`

export const CacheNames = {
	api: ns('api'),
	wallpaper: ns('wallpaper'),
	fonts: ns('fonts'),
	cdn: ns('cdn'),
	cdnCss: ns('cdn-css'),
	favicons: ns('favicons'),
} as const

export const EXPECTED_CACHES = new Set<string>(Object.values(CacheNames))

export const LEGACY_CACHES: string[] = [
	'cdn-cache-v1',
	'videos-cache-v1',
	'static-assets-v1',
	'fonts-cache-v1',
	'html-cache-v1',
	'navigation-cache-v1',
	'remote-fonts-css-cache',
	'widgetify-public-api',
	'critical-resources-v1',
	'images-cache-v1',
	'cross-origin-cache-v1',
	'widgetify-api-cache-v1',
]

export function resolveCacheName(logical: CacheName): string {
	switch (logical) {
		case CacheName.API:
			return CacheNames.api
		default:
			return CacheNames.api
	}
}
