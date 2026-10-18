import {
	CACHE_BASE,
	CACHE_PREFIX,
	PRECACHE_PREFIX,
} from '@/common/types/sw-events.interface'

export type StorageCategoryId =
	| 'wallpaper'
	| 'explorerImages'
	| 'onlineData'
	| 'fontsAndIcons'
	| 'appFiles'
	| 'leftovers'
	| 'browserExtra'
	| 'yourData'

export interface CacheUsage {
	name: string
	bytes: number
	files: number
}

export interface UsageCategory {
	id: StorageCategoryId
	bytes: number
	files: number
	clearable: boolean
}

export interface StorageUsageSummary {
	total: number
	clearableBytes: number
	categories: UsageCategory[]
}

const CATEGORY_BY_BASE: Record<string, StorageCategoryId> = {
	[CACHE_BASE.wallpaper]: 'wallpaper',
	[CACHE_BASE.catalogMedia]: 'explorerImages',
	[CACHE_BASE.api]: 'onlineData',
	[CACHE_BASE.fonts]: 'fontsAndIcons',
	[CACHE_BASE.cdn]: 'fontsAndIcons',
	[CACHE_BASE.cdnCss]: 'fontsAndIcons',
}

const VERSIONED_CACHE = new RegExp(`^${CACHE_PREFIX}(.+)-v[0-9.]+$`)

export function categorizeCache(name: string): StorageCategoryId {
	if (name.startsWith(PRECACHE_PREFIX)) return 'appFiles'
	const base = VERSIONED_CACHE.exec(name)?.[1]
	return (base && CATEGORY_BY_BASE[base]) || 'leftovers'
}

const NOT_CLEARABLE: StorageCategoryId[] = ['appFiles', 'yourData']

export function isClearableCache(name: string): boolean {
	return !NOT_CLEARABLE.includes(categorizeCache(name))
}

export function summarizeStorageUsage(input: {
	caches: CacheUsage[]
	userDataBytes: number
	browserReportedBytes: number
}): StorageUsageSummary {
	const byId = new Map<StorageCategoryId, UsageCategory>()
	const add = (id: StorageCategoryId, bytes: number, files: number) => {
		const current = byId.get(id) ?? {
			id,
			bytes: 0,
			files: 0,
			clearable: !NOT_CLEARABLE.includes(id),
		}
		current.bytes += bytes
		current.files += files
		byId.set(id, current)
	}

	let measuredCacheBytes = 0
	for (const cache of input.caches) {
		add(categorizeCache(cache.name), cache.bytes, cache.files)
		measuredCacheBytes += cache.bytes
	}

	const browserExtra = input.browserReportedBytes - measuredCacheBytes
	if (browserExtra > 0) add('browserExtra', browserExtra, 0)
	if (input.userDataBytes > 0) add('yourData', input.userDataBytes, 0)

	const categories = Array.from(byId.values())
		.filter((category) => category.bytes > 0 || category.files > 0)
		.sort((a, b) => b.bytes - a.bytes)

	let total = 0
	let clearableBytes = 0
	for (const category of categories) {
		total += category.bytes
		if (category.clearable) clearableBytes += category.bytes
	}

	return { total, clearableBytes, categories }
}

export type ByteUnit = 'kb' | 'mb' | 'gb'

const KB = 1024
const MB = KB * 1024
const GB = MB * 1024

export function formatBytes(bytes: number): { amount: number; unit: ByteUnit } {
	if (bytes >= GB) return { amount: Math.round((bytes / GB) * 10) / 10, unit: 'gb' }
	if (bytes >= MB) return { amount: Math.round((bytes / MB) * 10) / 10, unit: 'mb' }
	if (bytes <= 0) return { amount: 0, unit: 'kb' }
	return { amount: Math.max(1, Math.round(bytes / KB)), unit: 'kb' }
}
