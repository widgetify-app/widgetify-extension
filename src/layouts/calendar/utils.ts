import jalaliMoment from 'jalali-moment'
import hijriMoment from 'moment-hijri'

import type {
	FetchedAllEvents,
	FetchedEvent,
} from '../../services/getMethodHooks/getEvents.hook'

export const formatDateStr = (date: jalaliMoment.Moment) => {
	return `${(date.jMonth() + 1).toString().padStart(2, '0')}-${date.jDate().toString().padStart(2, '0')}`
}

export type WidgetifyDate = jalaliMoment.Moment

export function getShamsiEvents(
	events: FetchedAllEvents,
	selectedDate: jalaliMoment.Moment,
): FetchedEvent[] {
	const month = selectedDate.jMonth() + 1
	const day = selectedDate.jDate()
	return events.shamsiEvents.filter((event) => event.month === month && event.day === day)
}

export function convertShamsiToHijri(
	shamsiDate: jalaliMoment.Moment,
): hijriMoment.Moment {
	const adjustedDate = shamsiDate.clone().startOf('day').subtract(6, 'hours')
	const hijri = hijriMoment(adjustedDate.valueOf())

	return hijri
}

export function getHijriEvents(
	events: FetchedAllEvents,
	selectedDate: jalaliMoment.Moment,
): FetchedEvent[] {
	const hijriDate = convertShamsiToHijri(selectedDate)
	const month = hijriDate.iMonth() + 1
	const day = hijriDate.iDate()

	return events.hijriEvents.filter((event) => event.month === month && event.day === day)
}

export function getGregorianEvents(
	events: FetchedAllEvents,
	date: jalaliMoment.Moment, //  Hijri date
): FetchedEvent[] {
	const gregorianDate = date.clone().locale('en').utc().add(3.5, 'hours')

	const gregorianDay = gregorianDate.format('D')
	const gregorianMonth = gregorianDate.format('M')

	return events.gregorianEvents.filter(
		(event) => event.month === +gregorianMonth && event.day === +gregorianDay,
	)
}

export function getCurrentDate() {
	return jalaliMoment().locale('fa').utc().add(3.5, 'hours')
}
