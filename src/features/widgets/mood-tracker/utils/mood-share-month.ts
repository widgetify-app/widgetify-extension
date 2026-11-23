import { jalaliMonthDays } from '@/features/widgets/utils/jalali-month-days'

export const MOOD_ORDER = ['excited', 'happy', 'normal', 'sad'] as const
export type Mood = (typeof MOOD_ORDER)[number]

export interface MonthDay {
	mood: Mood | null
	state: 'logged' | 'empty' | 'future'
}

const tehranDate = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'Asia/Tehran',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
})

export function tehranDay(date: Date): string {
	const parts = tehranDate.formatToParts(date)
	const value = (type: string) => parts.find((part) => part.type === type)?.value

	return `${value('year')}-${value('month')}-${value('day')}`
}

function logDay(date: string | Date): string | null {
	if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date

	const instant = new Date(date)
	return Number.isNaN(instant.getTime()) ? null : tehranDay(instant)
}

export function moodShareMonth(
	entries: readonly { date: string | Date; mood: string }[],
	{ year, month }: { year: number; month: number },
	today: string
) {
	const moodsByDay = new Map<string, Mood>()

	for (const entry of entries) {
		const day = logDay(entry.date)
		const mood =
			entry.mood === 'tired'
				? 'normal'
				: MOOD_ORDER.find((mood) => mood === entry.mood)
		if (day && mood) moodsByDay.set(day, mood)
	}

	const counts = { excited: 0, happy: 0, normal: 0, sad: 0 }
	let logged = 0

	const days = jalaliMonthDays(year, month).map((day): MonthDay => {
		const mood = moodsByDay.get(day) ?? null

		if (mood) {
			counts[mood]++
			logged++
			return { mood, state: 'logged' }
		}

		return { mood, state: day > today ? 'future' : 'empty' }
	})

	const accent =
		logged === 0
			? 'happy'
			: MOOD_ORDER.reduce((most, mood) =>
					counts[mood] > counts[most] ? mood : most
				)

	return { days, counts, logged, accent }
}
