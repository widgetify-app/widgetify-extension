export enum HabitComparison {
	AT_LEAST = 'AT_LEAST',
	AT_MOST = 'AT_MOST',
	EXACT = 'EXACT',
}

export enum HabitUnit {
	TIMES = 'TIMES',
	MINUTES = 'MINUTES',
	HOURS = 'HOURS',
	PAGES = 'PAGES',
	GLASSES = 'GLASSES',
	CUSTOM = 'CUSTOM',
}

export enum HabitFrequency {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

export interface HabitDayProgress {
	date: string
	value: number
	isDone: boolean
}

export interface Habit {
	id: string
	title: string
	emoji: string | null
	color: string | null
	target: number
	comparison: HabitComparison
	unit: HabitUnit
	customUnit: string | null
	frequency: HabitFrequency
	frequencyCount: number
	sort: number
	archivedAt: string | null
	today: HabitDayProgress
	history: HabitDayProgress[]
	calendarData: Record<string, Record<string, { value: number; isDone: boolean }>>
	progressThisPeriod: {
		done: number
		required: number
	}
}

export interface CreateHabitInput {
	title: string
	emoji?: string
	color?: string
	comparison: HabitComparison
	unit: HabitUnit
	customUnit?: string
	target: number
	frequency: HabitFrequency
	frequencyCount?: number
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
	sort?: number
}

export interface LogHabitProgressInput {
	date: string
	amount: number
}