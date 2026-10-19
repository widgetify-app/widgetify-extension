import { describe, expect, it } from 'bun:test'
import {
	type CacheUsage,
	categorizeCache,
	formatBytes,
	isClearableCache,
	summarizeStorageUsage,
} from '../utils/storage-usage'

const MB = 1024 * 1024

function cache(name: string, bytes: number, files = 1): CacheUsage {
	return { name, bytes, files }
}

describe('categorizeCache', () => {
	it('groups the current caches by what they hold', () => {
		expect(categorizeCache('wgf-wallpaper-v2.0.10')).toBe('wallpaper')
		expect(categorizeCache('wgf-catalog-media-v2.0.10')).toBe('explorerImages')
		expect(categorizeCache('wgf-api-v2.0.10')).toBe('onlineData')
		expect(categorizeCache('wgf-fonts-v2.0.10')).toBe('fontsAndIcons')
		expect(categorizeCache('wgf-cdn-v2.0.10')).toBe('fontsAndIcons')
		expect(categorizeCache('wgf-cdn-css-v2.0.10')).toBe('fontsAndIcons')
	})

	it('treats the precache as the app files', () => {
		expect(categorizeCache('workbox-precache-v2-chrome-extension://abc/')).toBe(
			'appFiles'
		)
	})

	it('treats any other cache as leftovers from older versions', () => {
		expect(categorizeCache('images-cache-v1')).toBe('leftovers')
		expect(categorizeCache('wgf-unknown-v1')).toBe('leftovers')
	})
})

describe('isClearableCache', () => {
	it('clears every cache except the app files', () => {
		expect(isClearableCache('wgf-wallpaper-v2.0.10')).toBe(true)
		expect(isClearableCache('images-cache-v1')).toBe(true)
		expect(isClearableCache('workbox-precache-v2-x')).toBe(false)
	})
})

describe('summarizeStorageUsage', () => {
	it('adds caches of one kind together and sorts the biggest first', () => {
		const summary = summarizeStorageUsage({
			caches: [
				cache('wgf-cdn-v2', 1 * MB, 3),
				cache('wgf-wallpaper-v2', 5 * MB),
				cache('wgf-fonts-v2', 2 * MB, 4),
			],
			userDataBytes: 0,
			browserReportedBytes: 0,
		})

		expect(
			summary.categories.map((item) => [item.id, item.bytes, item.files])
		).toEqual([
			['wallpaper', 5 * MB, 1],
			['fontsAndIcons', 3 * MB, 7],
		])
		expect(summary.total).toBe(8 * MB)
	})

	it('shows the saved user data but never counts it as clearable', () => {
		const summary = summarizeStorageUsage({
			caches: [cache('wgf-api-v2', 1 * MB)],
			userDataBytes: 2 * MB,
			browserReportedBytes: 0,
		})

		const userData = summary.categories.find((item) => item.id === 'yourData')
		expect(userData?.clearable).toBe(false)
		expect(summary.clearableBytes).toBe(1 * MB)
	})

	it('keeps the app files out of what can be cleared', () => {
		const summary = summarizeStorageUsage({
			caches: [cache('workbox-precache-v2-x', 4 * MB), cache('wgf-api-v2', 1 * MB)],
			userDataBytes: 0,
			browserReportedBytes: 0,
		})

		expect(summary.clearableBytes).toBe(1 * MB)
	})

	it('names what the browser counts beyond the measured files', () => {
		const summary = summarizeStorageUsage({
			caches: [cache('images-cache-v1', 0, 300)],
			userDataBytes: 1 * MB,
			browserReportedBytes: 600 * MB,
		})

		const browserExtra = summary.categories.find((item) => item.id === 'browserExtra')
		expect(browserExtra?.bytes).toBe(600 * MB)
		expect(browserExtra?.clearable).toBe(true)
		expect(summary.total).toBe(601 * MB)
		expect(summary.clearableBytes).toBe(600 * MB)
	})

	it('drops empty kinds but keeps leftovers that still hold files', () => {
		const summary = summarizeStorageUsage({
			caches: [cache('wgf-api-v2', 0, 0), cache('images-cache-v1', 0, 12)],
			userDataBytes: 0,
			browserReportedBytes: 0,
		})

		expect(summary.categories.map((item) => item.id)).toEqual(['leftovers'])
	})

	it('reports nothing to clear on an empty profile', () => {
		const summary = summarizeStorageUsage({
			caches: [],
			userDataBytes: 0,
			browserReportedBytes: 0,
		})

		expect(summary).toEqual({ total: 0, clearableBytes: 0, categories: [] })
	})
})

describe('formatBytes', () => {
	it('picks a unit a person can read', () => {
		expect(formatBytes(0)).toEqual({ amount: 0, unit: 'kb' })
		expect(formatBytes(900)).toEqual({ amount: 1, unit: 'kb' })
		expect(formatBytes(9 * 1024)).toEqual({ amount: 9, unit: 'kb' })
		expect(formatBytes(1.25 * MB)).toEqual({ amount: 1.3, unit: 'mb' })
		expect(formatBytes(612 * MB)).toEqual({ amount: 612, unit: 'mb' })
		expect(formatBytes(2.5 * 1024 * MB)).toEqual({ amount: 2.5, unit: 'gb' })
	})
})
