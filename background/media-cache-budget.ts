export interface CachedMediaEntry {
	url: string
	bytes: number
	storedAt: number
}

export interface MediaCacheLimits {
	maxEntries: number
	maxBytes: number
	maxEntryBytes: number
	maxAgeMs: number
}

const MB = 1024 * 1024
const DAY_MS = 24 * 60 * 60 * 1000

export const CATALOG_MEDIA_LIMITS: MediaCacheLimits = {
	maxEntries: 300,
	maxBytes: 20 * MB,
	maxEntryBytes: 2 * MB,
	maxAgeMs: 14 * DAY_MS,
}

export const CATALOG_MEDIA_ORIGIN = 'https://s3-abyss.atlantiscloud.ir'
const CATALOG_MEDIA_PATH = '/widgetify-contents/catalog/'

export const STORED_AT_HEADER = 'x-wgf-stored-at'
export const BYTES_HEADER = 'x-wgf-bytes'

export function isCatalogMediaUrl(url: URL): boolean {
	return (
		url.origin === CATALOG_MEDIA_ORIGIN && url.pathname.startsWith(CATALOG_MEDIA_PATH)
	)
}

export function isWorthCaching(bytes: number, limits: MediaCacheLimits): boolean {
	return bytes > 0 && bytes <= limits.maxEntryBytes
}

export function readStampedNumber(value: string | null): number {
	const stamped = Number(value)
	return Number.isFinite(stamped) && stamped > 0 ? stamped : 0
}

export function selectMediaToEvict(
	entries: CachedMediaEntry[],
	limits: MediaCacheLimits,
	now: number
): string[] {
	const evicted: string[] = []
	const kept: CachedMediaEntry[] = []

	for (const entry of entries) {
		const expired = entry.storedAt <= 0 || now - entry.storedAt >= limits.maxAgeMs
		const sizeUnknown = !(entry.bytes > 0)
		if (expired || sizeUnknown) evicted.push(entry.url)
		else kept.push(entry)
	}

	const oldestFirst = kept.slice().sort((a, b) => a.storedAt - b.storedAt)
	let count = oldestFirst.length
	let bytes = oldestFirst.reduce((total, entry) => total + entry.bytes, 0)

	for (const entry of oldestFirst) {
		if (count <= limits.maxEntries && bytes <= limits.maxBytes) break
		evicted.push(entry.url)
		count -= 1
		bytes -= entry.bytes
	}

	return evicted
}
