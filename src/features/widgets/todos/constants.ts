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
	high: 'border-danger!',
	medium: 'border-warning!',
	low: 'border-success!',
	default: 'border-brand!',
}

export const PRIORITY_CHECKED_CLASS: Record<string, string> = {
	high: 'border-danger! bg-danger!',
	medium: 'border-warning! bg-warning!',
	low: 'border-success! bg-success!',
	default: 'border-brand! bg-brand!',
}

export const PRIORITY_BADGE_CLASS: Record<string, string> = {
	high: 'bg-danger-fill text-danger',
	medium: 'bg-warning-fill text-warning',
	low: 'bg-success-fill text-success',
	default: 'bg-brand-fill text-brand',
}

export function priorityClass(map: Record<string, string>, priority?: string): string {
	return map[priority ?? ''] ?? map.default
}
