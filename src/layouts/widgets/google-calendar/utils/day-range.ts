import momentTz from 'moment-timezone'

export function toZonedDayStart(isoDay: string, timezone: string): string {
	return momentTz.tz(`${isoDay}T00:00:00`, timezone).format()
}

export function toZonedDayEnd(isoDay: string, timezone: string): string {
	return momentTz.tz(`${isoDay}T23:59:59`, timezone).format()
}
