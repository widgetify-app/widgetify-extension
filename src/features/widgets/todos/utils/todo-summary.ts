import { t } from '@/common/i18n'
interface TodoSummaryInput {
	total: number
	completed: number
	isPartial: boolean
}

export function todoSummary({ total, completed, isPartial }: TodoSummaryInput): string {
	if (total === 0) return ''
	if (isPartial) return t('widgets.todos.summary.count', { p0: total })
	return t('widgets.todos.summary.doneOf', { p0: completed, p1: total })
}
