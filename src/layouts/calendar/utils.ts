import type jalaliMoment from 'jalali-moment'
import hijriMoment from 'moment-hijri'

import type {
	FetchedAllEvents,
	FetchedEvent,
} from '../../services/getMethodHooks/getEvents.hook'
export const formatDateStr = (date: jalaliMoment.Moment) => {
	return `${(date.jMonth() + 1).toString().padStart(2, '0')}-${date.jDate().toString().padStart(2, '0')}`
}

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
	const shamsiMonth = shamsiDate.jMonth() + 1
	const shamsiDay = shamsiDate.jDate()

	let hijriDate = hijriMoment(
		shamsiDate.utc().startOf('day').format('YYYY-MM-DD'),
		'YYYY-MM-DD',
	)

	// تنظیم اختلاف بر اساس روز و ماه شمسی
	if (shamsiMonth <= 6) {
		// فروردین تا شهریور
		if (shamsiDay <= 20) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	} else if (shamsiMonth <= 11) {
		// مهر تا بهمن
		if (shamsiDay <= 21) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	} else {
		// اسفند
		if (shamsiDay <= 20) {
			hijriDate = hijriDate.subtract(1, 'day')
		}
	}

	return hijriDate
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
	selectedDate: jalaliMoment.Moment, //  Hijri date
): FetchedEvent[] {
	const gregorianDay = selectedDate.format('D')
	const gregorianMonth = selectedDate.format('M')
	return events.gregorianEvents.filter(
		(event) => event.month === +gregorianMonth && event.day === +gregorianDay,
	)
}
