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
]

/**
 * Maps the logical cache name sent in a message to the versioned cache it
 * actually lives in.
 *
 * A Record (rather than a switch with a catch-all default) makes this
 * exhaustive: adding a member to `CacheName` becomes a TypeScript error here
 * instead of silently resolving to the API cache.
 */
const CACHE_BY_LOGICAL_NAME: Record<CacheName, string> = {
	[CacheName.API]: CacheNames.api,
}

export function resolveCacheName(logical: CacheName): string {
	return CACHE_BY_LOGICAL_NAME[logical] ?? CacheNames.api
}
