import jalaliMoment from 'jalali-moment'

const DAY_MS = 24 * 60 * 60 * 1000

type FriendsSincePeriod =
	| { unit: 'new'; count: 0 }
	| { unit: 'months'; count: number }
	| { unit: 'years'; count: number }

export function friendsSincePeriod(since: string, now: Date): FriendsSincePeriod {
	const days = Math.floor((now.getTime() - new Date(since).getTime()) / DAY_MS)

	if (days < 30) return { unit: 'new', count: 0 }
	if (days < 365) return { unit: 'months', count: Math.floor(days / 30) }

	return { unit: 'years', count: Math.floor(days / 365) }
}

export function birthdayParts(
	birthday: { month: number; day: number },
	today: Date
): { day: number; monthName: string; isToday: boolean } {
	const now = jalaliMoment(today).locale('fa')
	const monthName = jalaliMoment
		.from(`1405/${String(birthday.month).padStart(2, '0')}/01`, 'fa', 'YYYY/MM/DD')
		.locale('fa')
		.format('jMMMM')

	return {
		day: birthday.day,
		monthName,
		isToday: now.jMonth() + 1 === birthday.month && now.jDate() === birthday.day,
	}
}

export function memberSinceYear(createdAt: string): number {
	return jalaliMoment(createdAt).jYear()
}

export function mutualSummary(
	count: number,
	names: string[]
): { names: string[]; others: number } {
	const shown = names.slice(0, 2)

	return { names: shown, others: Math.max(0, count - shown.length) }
}
