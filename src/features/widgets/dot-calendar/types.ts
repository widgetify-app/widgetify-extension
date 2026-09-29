export type DotCalendarVariant = 'year' | 'goal'

export interface DotCalendarMeta {
	variant?: DotCalendarVariant | string
	goalTitle?: string
	goalStartDate?: string
	goalEndDate?: string
}

export interface DotProgress {
	totalDays: number
	passedDays: number
	daysLeft: number
}

export interface YearProgress extends DotProgress {
	year: number
}
