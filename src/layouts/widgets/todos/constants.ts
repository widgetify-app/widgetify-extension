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
	high: 'border-ds-danger!',
	medium: 'border-ds-warning!',
	low: 'border-ds-success!',
	default: 'border-ds-brand!',
}

export const PRIORITY_CHECKED_CLASS: Record<string, string> = {
	high: 'border-ds-danger! bg-ds-danger!',
	medium: 'border-ds-warning! bg-ds-warning!',
	low: 'border-ds-success! bg-ds-success!',
	default: 'border-ds-brand! bg-ds-brand!',
}

export const PRIORITY_BADGE_CLASS: Record<string, string> = {
	high: 'bg-ds-danger-fill text-ds-danger',
	medium: 'bg-ds-warning-fill text-ds-warning',
	low: 'bg-success-subtle text-ds-success',
	default: 'bg-ds-brand-fill text-ds-brand',
}

export function priorityClass(map: Record<string, string>, priority?: string): string {
	return map[priority ?? ''] ?? map.default
}
