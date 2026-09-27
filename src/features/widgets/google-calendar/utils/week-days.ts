import { DAYS_IN_WEEK } from '@/features/widgets/constants'
import type { WidgetifyDate } from '@/common/utils/date-events'

export function getWeekDays(referenceDate: WidgetifyDate): WidgetifyDate[] {
	const dayOfWeek = (referenceDate.day() + 1) % DAYS_IN_WEEK
	const startOfWeek = referenceDate.clone().subtract(dayOfWeek, 'days')

	return Array.from({ length: DAYS_IN_WEEK }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)
}
