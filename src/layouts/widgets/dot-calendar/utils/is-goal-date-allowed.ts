import type jalaliMoment from 'jalali-moment'
import { GOAL_MAX_DAYS } from '../constants'

export function isGoalDateAllowed(
	date: jalaliMoment.Moment,
	today: jalaliMoment.Moment
): boolean {
	const daysAhead = date
		.clone()
		.startOf('day')
		.diff(today.clone().startOf('day'), 'days')

	return daysAhead >= 1 && daysAhead < GOAL_MAX_DAYS
}
