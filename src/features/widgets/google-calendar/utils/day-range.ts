function parts(ms: number, timeZone: string) {
	const f = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).formatToParts(new Date(ms))
	const v = (t: string) => Number(f.find((p) => p.type === t)?.value)
	return Date.UTC(
		v('year'),
		v('month') - 1,
		v('day'),
		v('hour'),
		v('minute'),
		v('second')
	)
}

function formatInZone(isoDay: string, time: string, timeZone: string): string {
	const wall = Date.parse(`${isoDay}T${time}Z`)
	let offset = parts(wall, timeZone) - wall
	offset = parts(wall - offset, timeZone) - (wall - offset)
	if (offset === 0) return `${isoDay}T${time}Z`
	const abs = Math.abs(offset) / 60_000
	const sign = offset < 0 ? '-' : '+'
	const hh = String(Math.floor(abs / 60)).padStart(2, '0')
	const mm = String(abs % 60).padStart(2, '0')
	return `${isoDay}T${time}${sign}${hh}:${mm}`
}

export function toZonedDayStart(isoDay: string, timezone: string): string {
	return formatInZone(isoDay, '00:00:00', timezone)
}

export function toZonedDayEnd(isoDay: string, timezone: string): string {
	return formatInZone(isoDay, '23:59:59', timezone)
}
