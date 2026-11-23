import { describe, expect, it } from 'bun:test'
import { moodShareMonth } from '../utils/mood-share-month'

const ABAN = { year: 1405, month: 8 }

describe('moodShareMonth', () => {
	it('counts one mood per Tehran date in the selected month and year', () => {
		const result = moodShareMonth(
			[
				{ date: '2025-10-23', mood: 'sad' },
				{ date: '2026-10-22', mood: 'sad' },
				{ date: '2026-10-23', mood: 'sad' },
				{ date: new Date('2026-10-22T21:00:00Z'), mood: 'tired' },
				{ date: '2026-10-24', mood: 'excited' },
				{ date: '2026-10-25', mood: 'unknown' },
				{ date: 'invalid', mood: 'sad' },
			],
			ABAN,
			'2026-10-25'
		)

		expect(result.days).toHaveLength(30)
		expect(result.days.slice(0, 4)).toEqual([
			{ mood: 'normal', state: 'logged' },
			{ mood: 'excited', state: 'logged' },
			{ mood: null, state: 'empty' },
			{ mood: null, state: 'future' },
		])
		expect(result.counts).toEqual({ excited: 1, happy: 0, normal: 1, sad: 0 })
		expect(result.logged).toBe(2)
		expect(result.accent).toBe('excited')
	})

	it('includes the last day of a leap Esfand and falls back to happy without logs', () => {
		const result = moodShareMonth([], { year: 1403, month: 12 }, '2025-03-21')

		expect(result.days).toHaveLength(30)
		expect(result.days.every((day) => day.state === 'empty')).toBe(true)
		expect(result.logged).toBe(0)
		expect(result.accent).toBe('happy')
	})
})
