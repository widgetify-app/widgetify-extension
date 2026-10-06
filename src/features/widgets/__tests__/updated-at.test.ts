import { describe, expect, it } from 'bun:test'
import { formatUpdatedAt } from '../utils/updated-at'

describe('formatUpdatedAt', () => {
	it('shows the local time of the last update in Persian digits', () => {
		expect(formatUpdatedAt(new Date(2026, 0, 1, 14, 30).getTime())).toBe(
			'به‌روز ۱۴:۳۰'
		)
	})

	it('pads the hour and keeps a 24 hour clock', () => {
		expect(formatUpdatedAt(new Date(2026, 0, 1, 9, 5).getTime())).toBe('به‌روز ۰۹:۰۵')
		expect(formatUpdatedAt(new Date(2026, 0, 1, 0, 0).getTime())).toBe('به‌روز ۰۰:۰۰')
	})

	it('says nothing before the first update', () => {
		expect(formatUpdatedAt(0)).toBeNull()
	})
})
