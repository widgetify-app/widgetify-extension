import { fromZonedTime } from 'date-fns-tz'

export function GetTimeInZone(timeZone: string) {
	return fromZonedTime(new Date(), timeZone)
}
