import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { GOAL_MAX_DAYS } from '../constants'
import { getGoalProgress } from '../utils/get-goal-progress'

function day(iso: string) {
	return jalaliMoment(iso, 'YYYY-MM-DD').locale('fa')
}

describe('getGoalProgress', () => {
	it('draws both the start and the end day but counts the days until the goal', () => {
		const progress = getGoalProgress('2026-01-01', '2026-01-10', day('2026-01-01'))

		expect(progress).toEqual({ totalDays: 10, passedDays: 0, daysLeft: 9 })
	})

	it('moves one dot per elapsed day', () => {
		const progress = getGoalProgress('2026-01-01', '2026-01-10', day('2026-01-04'))

		expect(progress).toEqual({ totalDays: 10, passedDays: 3, daysLeft: 6 })
	})

	it('says one day left the day before the goal', () => {
		const progress = getGoalProgress('2026-01-01', '2026-01-02', day('2026-01-01'))

		expect(progress?.daysLeft).toBe(1)
	})

	it('reports the goal reached on the goal day itself, ringing its last dot', () => {
		const progress = getGoalProgress('2026-01-01', '2026-01-10', day('2026-01-10'))

		expect(progress).toEqual({ totalDays: 10, passedDays: 9, daysLeft: 0 })
	})

	it('reports nothing left once the goal day has passed', () => {
		const progress = getGoalProgress('2026-01-01', '2026-01-10', day('2026-02-01'))

		expect(progress).toEqual({ totalDays: 10, passedDays: 10, daysLeft: 0 })
	})

	it('does not count days before the goal started', () => {
		const progress = getGoalProgress('2026-01-05', '2026-01-10', day('2026-01-01'))

		expect(progress?.passedDays).toBe(0)
	})

	it('returns null when the goal is missing, malformed or reversed', () => {
		const today = day('2026-01-01')

		expect(getGoalProgress(undefined, '2026-01-10', today)).toBeNull()
		expect(getGoalProgress('2026-01-01', undefined, today)).toBeNull()
		expect(getGoalProgress('not-a-date', '2026-01-10', today)).toBeNull()
		expect(getGoalProgress('2026-01-10', '2026-01-01', today)).toBeNull()
	})

	it('refuses a range longer than the widget can draw', () => {
		const start = day('2026-01-01')
		const end = start.clone().add(GOAL_MAX_DAYS, 'days')

		expect(
			getGoalProgress(
				'2026-01-01',
				end.clone().locale('en').format('YYYY-MM-DD'),
				start
			)
		).toBeNull()
	})
})
