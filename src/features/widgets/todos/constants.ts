export interface TodoFilterOption {
	value: string
	label: string
}

export const DATE_FILTER_OPTIONS: TodoFilterOption[] = [
	{ value: 'all', label: 'همه' },
	{ value: 'today', label: 'امروز' },
	{ value: 'this_month', label: 'این ماه' },
	{ value: 'done', label: 'تکمیل‌شده' },
	{ value: 'pending', label: 'در انتظار' },
]

export const SORT_OPTIONS: TodoFilterOption[] = [
	{ value: 'def', label: 'پیشفرض' },
	{ value: 'high', label: 'مهم' },
	{ value: 'medium', label: 'متوسط' },
	{ value: 'low', label: 'کم اهمیت' },
]

export const LEGACY_DATE_FILTERS: Record<string, string> = {
	thisMonth: 'this_month',
}

export const UNFILTERED_TAGS = ['', '-all-']

export const PRIORITY_LABELS: Record<string, string> = {
	low: 'کم',
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
