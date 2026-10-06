import { describe, expect, it } from 'bun:test'
import { formatTimeAgo } from '../utils/time-ago'

const NOW = Date.UTC(2026, 9, 4, 12, 0)

describe('formatTimeAgo', () => {
	it('says just now for the last minute and for a clock running ahead', () => {
		expect(formatTimeAgo(NOW - 30_000, NOW)).toBe('همین الان')
		expect(formatTimeAgo(NOW + 120_000, NOW)).toBe('همین الان')
	})

	it('counts whole minutes, hours and days', () => {
		expect(formatTimeAgo(NOW - 20 * 60_000, NOW)).toBe('۲۰ دقیقه پیش')
		expect(formatTimeAgo(NOW - 59 * 60_000, NOW)).toBe('۵۹ دقیقه پیش')
		expect(formatTimeAgo(NOW - 90 * 60_000, NOW)).toBe('۱ ساعت پیش')
		expect(formatTimeAgo(NOW - 50 * 3_600_000, NOW)).toBe('۲ روز پیش')
	})

	it('reads the date strings a feed sends', () => {
		expect(formatTimeAgo('2026-10-04T11:00:00Z', NOW)).toBe('۱ ساعت پیش')
		expect(formatTimeAgo('Sun, 04 Oct 2026 09:00:00 GMT', NOW)).toBe('۳ ساعت پیش')
	})

	it('says nothing for a date it cannot read', () => {
		expect(formatTimeAgo('not a date', NOW)).toBeNull()
		expect(formatTimeAgo('', NOW)).toBeNull()
	})
})
