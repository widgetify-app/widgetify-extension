import { t } from '@/common/i18n'
export interface TodoFilterOption {
	value: string
	label: string
}

export const DATE_FILTER_OPTIONS: TodoFilterOption[] = [
	{ value: 'all', label: t('widgets.todos.filter.all') },
	{ value: 'today', label: t('widgets.todos.filter.today') },
	{ value: 'this_month', label: t('widgets.todos.filter.thisMonth') },
	{ value: 'done', label: t('widgets.todos.filter.done') },
	{ value: 'pending', label: t('widgets.todos.filter.undone') },
]

export const SORT_OPTIONS: TodoFilterOption[] = [
	{ value: 'def', label: t('widgets.todos.filter.sortDefault') },
	{ value: 'high', label: t('widgets.todos.filter.sortHighFirst') },
	{ value: 'medium', label: t('widgets.todos.filter.sortMediumFirst') },
	{ value: 'low', label: t('widgets.todos.filter.sortLowFirst') },
]

export const LEGACY_DATE_FILTERS: Record<string, string> = {
	thisMonth: 'this_month',
}

export const UNFILTERED_TAGS = ['', '-all-']

export const PRIORITY_LABELS: Record<string, string> = {
	low: t('widgets.todos.priority.low'),
	medium: t('widgets.todos.priority.medium'),
	high: t('widgets.todos.priority.high'),
}

export const PRIORITY_BORDER_CLASS: Record<string, string> = {
	high: 'border-danger',
	medium: 'border-warning',
	low: 'border-success',
	default: 'border-fg-ghost',
}

export function priorityClass(map: Record<string, string>, priority?: string): string {
	return map[priority ?? ''] ?? map.default
}
