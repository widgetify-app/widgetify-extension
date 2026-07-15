// Network-first: try the network, fall back to cache when offline/slow.
export const NETWORK_FIRST_API_PATHS = [
	'/extension/wigi-pad-data',
	'/date/events',
	'/news/rss',
	'/contents',
	'/extension/notifications',
	'/extension/searchbox',
]

// Stale-while-revalidate: return the cached response instantly, refresh in the background.
export const SWR_API_PATHS = ['/searchbox', '/currencies', '/weather']

export const NEVER_CACHE_API_PATHS = ['/searchbox/suggest-search']

export const CDN_NO_CACHE_PREFIXES = ['/wallpapers/', '/avatars/']
