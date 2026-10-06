import { describe, expect, it } from 'bun:test'
import { normalizeCalendarDisplay } from '../utils/normalize-calendar-display'

describe('normalizeCalendarDisplay', () => {
	it('shows events and moods on a calendar that never set them', () => {
		expect(normalizeCalendarDisplay(undefined)).toEqual({
			showEvents: true,
			showMoods: true,
		})
		expect(normalizeCalendarDisplay({})).toEqual({
			showEvents: true,
			showMoods: true,
		})
	})

	it('hides only what was switched off', () => {
		expect(normalizeCalendarDisplay({ showEvents: false })).toEqual({
			showEvents: false,
			showMoods: true,
		})
		expect(normalizeCalendarDisplay({ showMoods: false })).toEqual({
			showEvents: true,
			showMoods: false,
		})
	})

	it('reads anything but false as on', () => {
		expect(normalizeCalendarDisplay({ showEvents: 'no', showMoods: 0 })).toEqual({
			showEvents: true,
			showMoods: true,
		})
		expect(normalizeCalendarDisplay('calendar')).toEqual({
			showEvents: true,
			showMoods: true,
		})
	})
})
