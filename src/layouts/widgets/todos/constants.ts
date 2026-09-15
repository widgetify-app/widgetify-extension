import type { FilterOption } from '@/components/ui'

export const DATE_FILTER_OPTIONS: FilterOption[] = [
	{ value: 'all', label: 'همه' },
	{ value: 'today', label: 'امروز' },
	{ value: 'this_month', label: 'این ماه' },
	{ value: 'done', label: 'تکمیل‌شده' },
	{ value: 'pending', label: 'در انتظار' },
]

export const SORT_OPTIONS: FilterOption[] = [
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
	high: 'border-error!',
	medium: 'border-warning!',
	low: 'border-success!',
	default: 'border-primary!',
}

export const PRIORITY_CHECKED_CLASS: Record<string, string> = {
	high: 'border-error! bg-error!',
	medium: 'border-warning! bg-warning!',
	low: 'border-success! bg-success!',
	default: 'border-primary! bg-primary!',
}

export const PRIORITY_BADGE_CLASS: Record<string, string> = {
	high: 'bg-error/10 text-error',
	medium: 'bg-warning/10 text-warning',
	low: 'bg-success/10 text-success',
	default: 'bg-primary/10 text-primary',
}

export function priorityClass(map: Record<string, string>, priority?: string): string {
	return map[priority ?? ''] ?? map.default
}
