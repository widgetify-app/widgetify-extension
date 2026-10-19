import { describe, expect, it } from 'bun:test'
import {
	CATALOG_MEDIA_LIMITS,
	type CachedMediaEntry,
	isCatalogMediaUrl,
	isWorthCaching,
	type MediaCacheLimits,
	readStampedNumber,
	selectMediaToEvict,
} from '../media-cache-budget'

const MINUTE = 60 * 1000
const NOW = 1_000_000_000

const limits: MediaCacheLimits = {
	maxEntries: 3,
	maxBytes: 1000,
	maxEntryBytes: 600,
	maxAgeMs: 10 * MINUTE,
}

function entry(url: string, bytes: number, minutesAgo: number): CachedMediaEntry {
	return { url, bytes, storedAt: NOW - minutesAgo * MINUTE }
}

describe('selectMediaToEvict', () => {
	it('keeps everything that is young and within the budget', () => {
		const entries = [entry('a', 100, 1), entry('b', 100, 2)]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual([])
	})

	it('evicts entries past the maximum age', () => {
		const entries = [entry('old', 100, 11), entry('fresh', 100, 1)]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['old'])
	})

	it('evicts an entry with no stored time as expired', () => {
		const entries = [
			{ url: 'unknown', bytes: 100, storedAt: 0 },
			entry('fresh', 100, 1),
		]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['unknown'])
	})

	it('evicts the oldest entries first when over the entry cap', () => {
		const entries = [
			entry('newest', 10, 1),
			entry('oldest', 10, 5),
			entry('middle', 10, 3),
			entry('older', 10, 4),
			entry('newer', 10, 2),
		]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['oldest', 'older'])
	})

	it('evicts the oldest entries first until the total fits the byte cap', () => {
		const entries = [entry('a', 400, 3), entry('b', 400, 2), entry('c', 400, 1)]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['a'])
	})

	it('counts expired entries out before applying the caps', () => {
		const entries = [
			entry('expired', 900, 20),
			entry('a', 300, 3),
			entry('b', 300, 2),
			entry('c', 300, 1),
		]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['expired'])
	})

	it('evicts an entry whose size is unknown', () => {
		const entries = [
			{ url: 'broken', bytes: Number.NaN, storedAt: NOW },
			{ url: 'missing', bytes: 0, storedAt: NOW },
			entry('ok', 10, 1),
		]
		expect(selectMediaToEvict(entries, limits, NOW)).toEqual(['broken', 'missing'])
	})

	it('does not change the order of the input', () => {
		const entries = [entry('b', 10, 1), entry('a', 10, 2)]
		selectMediaToEvict(entries, limits, NOW)
		expect(entries.map((item) => item.url)).toEqual(['b', 'a'])
	})
})

describe('isWorthCaching', () => {
	it('accepts a non empty file within the per entry cap', () => {
		expect(isWorthCaching(600, limits)).toBe(true)
	})

	it('rejects an empty body, which is what an opaque response reports', () => {
		expect(isWorthCaching(0, limits)).toBe(false)
	})

	it('rejects a file larger than the per entry cap', () => {
		expect(isWorthCaching(601, limits)).toBe(false)
	})
})

describe('readStampedNumber', () => {
	it('reads a stamped number', () => {
		expect(readStampedNumber(String(NOW))).toBe(NOW)
	})

	it('returns zero when the header is missing or broken', () => {
		expect(readStampedNumber(null)).toBe(0)
		expect(readStampedNumber('later')).toBe(0)
	})
})

describe('isCatalogMediaUrl', () => {
	it('matches catalog media on the content bucket', () => {
		expect(
			isCatalogMediaUrl(
				new URL(
					'https://s3-abyss.atlantiscloud.ir/widgetify-contents/catalog/b38d1516-0d6d-430b-b339-9415ca373e09.png'
				)
			)
		).toBe(true)
	})

	it('ignores other folders and other hosts', () => {
		expect(
			isCatalogMediaUrl(
				new URL(
					'https://s3-abyss.atlantiscloud.ir/widgetify-contents/wallpapers/a.png'
				)
			)
		).toBe(false)
		expect(
			isCatalogMediaUrl(
				new URL('https://example.com/widgetify-contents/catalog/a.png')
			)
		).toBe(false)
	})
})

describe('CATALOG_MEDIA_LIMITS', () => {
	it('stays a few tens of megabytes at most', () => {
		expect(CATALOG_MEDIA_LIMITS.maxBytes).toBeLessThanOrEqual(50 * 1024 * 1024)
		expect(CATALOG_MEDIA_LIMITS.maxEntryBytes).toBeLessThan(
			CATALOG_MEDIA_LIMITS.maxBytes
		)
	})
})
