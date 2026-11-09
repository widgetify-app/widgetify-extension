import { describe, expect, it } from 'bun:test'
import { formatBadgeCount } from '../badge-count'

describe('formatBadgeCount', () => {
	it('shows the exact count in Persian digits below the cap', () => {
		expect(formatBadgeCount(1)).toBe('۱')
		expect(formatBadgeCount(9)).toBe('۹')
	})

	it('collapses to +10 from ten upward', () => {
		expect(formatBadgeCount(10)).toBe('+۱۰')
		expect(formatBadgeCount(42)).toBe('+۱۰')
	})
})
