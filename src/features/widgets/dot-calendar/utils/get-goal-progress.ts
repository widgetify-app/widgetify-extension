import jalaliMoment from 'jalali-moment'
import { GOAL_DATE_FORMAT, GOAL_MAX_DAYS } from '../constants'
import type { DotProgress } from '../types'

function parseGoalDate(value?: string): jalaliMoment.Moment | null {
	if (!value) return null

	const date = jalaliMoment(value, GOAL_DATE_FORMAT, true)
	return date.isValid() ? date.startOf('day') : null
}

export function getGoalProgress(
	startDate: string | undefined,
	endDate: string | undefined,
	today: jalaliMoment.Moment
): DotProgress | null {
	const start = parseGoalDate(startDate)
	const end = parseGoalDate(endDate)
	if (!start || !end || end.isBefore(start)) return null

	const totalDays = end.diff(start, 'days') + 1
	if (totalDays > GOAL_MAX_DAYS) return null

	const elapsedDays = today.clone().startOf('day').diff(start, 'days')
	const passedDays = Math.min(Math.max(elapsedDays, 0), totalDays)

	return {
		totalDays,
		passedDays,
		daysLeft: totalDays - passedDays,
	}
}
