export interface TodoFilterOption {
	value: string
	label: string
}

export const DATE_FILTER_OPTIONS: TodoFilterOption[] = [
	{ value: 'all', label: 'همه' },
	{ value: 'today', label: 'امروز' },
	{ value: 'this_month', label: 'این ماه' },
	{ value: 'done', label: 'انجام‌شده' },
	{ value: 'pending', label: 'انجام‌نشده' },
]

export const SORT_OPTIONS: TodoFilterOption[] = [
	{ value: 'def', label: 'پیش‌فرض' },
	{ value: 'high', label: 'اول مهم‌ها' },
	{ value: 'medium', label: 'اول متوسط‌ها' },
	{ value: 'low', label: 'اول کم‌اهمیت‌ها' },
]

export const LEGACY_DATE_FILTERS: Record<string, string> = {
	thisMonth: 'this_month',
}

export const UNFILTERED_TAGS = ['', '-all-']

export const PRIORITY_LABELS: Record<string, string> = {
	low: 'کم‌اهمیت',
	medium: 'متوسط',
	high: 'مهم',
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
