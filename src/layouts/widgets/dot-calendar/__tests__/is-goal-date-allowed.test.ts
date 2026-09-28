import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { GOAL_MAX_DAYS } from '../constants'
import { getGoalProgress } from '../utils/get-goal-progress'
import { isGoalDateAllowed } from '../utils/is-goal-date-allowed'

const today = jalaliMoment('2026-03-01', 'YYYY-MM-DD').locale('fa')

function daysFromToday(days: number) {
	return today.clone().add(days, 'days')
}

describe('isGoalDateAllowed', () => {
	it('rejects today and every day before it', () => {
		expect(isGoalDateAllowed(today, today)).toBe(false)
		expect(isGoalDateAllowed(daysFromToday(-1), today)).toBe(false)
	})

	it('accepts tomorrow', () => {
		expect(isGoalDateAllowed(daysFromToday(1), today)).toBe(true)
	})

	it('accepts the furthest day the widget can still draw, and nothing past it', () => {
		expect(isGoalDateAllowed(daysFromToday(GOAL_MAX_DAYS - 1), today)).toBe(true)
		expect(isGoalDateAllowed(daysFromToday(GOAL_MAX_DAYS), today)).toBe(false)
	})

	it('ignores the time of day', () => {
		const lateTonight = today.clone().hour(23).minute(59)
		expect(isGoalDateAllowed(daysFromToday(1), lateTonight)).toBe(true)
	})

	it('agrees with the widget on the longest goal it will draw', () => {
		const iso = (date: jalaliMoment.Moment) =>
			date.clone().locale('en').format('YYYY-MM-DD')
		const furthest = daysFromToday(GOAL_MAX_DAYS - 1)

		expect(getGoalProgress(iso(today), iso(furthest), today)).not.toBeNull()
	})
})
