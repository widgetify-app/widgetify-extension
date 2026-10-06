import { describe, expect, it } from 'bun:test'
import { formatTimeLeft, minutesUntil, nextPrayerIndex } from '../utils/next-prayer'

const times = ['05:12', '06:38', '12:01', '17:24', '17:44', '23:09']
const at = (clock: string) => new Date(`2026-10-01T${clock}:00`)

describe('nextPrayerIndex', () => {
	it('finds the first time still ahead today', () => {
		expect(nextPrayerIndex(times, at('14:35'))).toBe(3)
		expect(nextPrayerIndex(times, at('04:00'))).toBe(0)
	})

	it('skips a time that is exactly now', () => {
		expect(nextPrayerIndex(times, at('12:01'))).toBe(3)
	})

	it('has no next time after the last one', () => {
		expect(nextPrayerIndex(times, at('23:30'))).toBe(-1)
	})

	it('ignores times that are missing or unreadable', () => {
		expect(nextPrayerIndex([undefined, 'soon', '18:00'], at('10:00'))).toBe(2)
	})
})

describe('minutesUntil and formatTimeLeft', () => {
	it('counts the minutes to a time', () => {
		expect(minutesUntil('17:24', at('14:35'))).toBe(169)
	})

	it('writes hours and minutes, or only minutes when under an hour', () => {
		expect(formatTimeLeft(169)).toBe('2:49 دیگه')
		expect(formatTimeLeft(20)).toBe('20 دقیقه دیگه')
	})
})
