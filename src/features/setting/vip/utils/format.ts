const persian = new Intl.NumberFormat('fa-IR')

export function formatNumber(value: number): string {
	return persian.format(value)
}

export function formatClock(date: Date, timeZone?: string): string {
	return new Intl.DateTimeFormat('fa-IR', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone,
	}).format(date)
}
