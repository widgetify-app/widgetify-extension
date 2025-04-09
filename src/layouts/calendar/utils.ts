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

export const iranianHijriMonthDays: { [key: number]: { [key: number]: number } } = {
	1445: {
		1: 30,
		2: 29,
		3: 30,
		4: 29,
		5: 30,
		6: 29,
		7: 30,
		8: 29,
		9: 30,
		10: 29,
		11: 30,
		12: 29,
	},
	1446: {
		1: 30, // 1= محرم
		2: 30, // 2= صفر
		3: 30, // 3= ربیع الاول
		4: 29, // 4= ربیع الثانی
		5: 30, // 5= 	جمادی الاول
		6: 30, // 6= 	جمادی الثانی
		7: 29, // 7=  رجب
		8: 30, // 8=  شعبان
		9: 29, // 9= رمضان
		10: 29, // 10=  شوال
		11: 29, // 11=  ذوالقعده
		12: 30, // 12=  ذوالحجه
	},
	1447: {
		1: 29,
		2: 30,
		3: 30,
		4: 30,
		5: 30,
		6: 29,
		7: 30,
		8: 29,
		9: 30,
		10: 29,
		11: 30,
		12: 29,
	},
}

export function getShamsiEvents(
	events: FetchedAllEvents,
	selectedDate: jalaliMoment.Moment,
): FetchedEvent[] {
	const month = selectedDate.jMonth() + 1
	const day = selectedDate.jDate()
	return events.shamsiEvents.filter((event) => event.month === month && event.day === day)
}

// rewritten by Grok
export function convertShamsiToHijri(
	shamsiDate: jalaliMoment.Moment,
): hijriMoment.Moment {
	const referenceShamsi = jalaliMoment
		.from('1402/04/28', 'fa', 'YYYY/MM/DD')
		.startOf('day')
	const referenceHijri = { year: 1445, month: 1, day: 1 }

	const daysPassed = shamsiDate.startOf('day').diff(referenceShamsi, 'days')

	if (daysPassed < 0) {
		return hijriMoment('1445-01-01', 'iYYYY-iM-iD') // fake date to avoid crash
	}

	let remainingDays = daysPassed
	let currentYear = referenceHijri.year
	let currentMonth = referenceHijri.month
	let currentDay = referenceHijri.day

	while (remainingDays > 0) {
		if (!iranianHijriMonthDays[currentYear]) {
			// fake year to avoid crash
			currentYear = 1448
			currentMonth = 1
			currentDay = 1
			remainingDays = 0
			break
		}

		const daysInMonth = iranianHijriMonthDays[currentYear][currentMonth]

		if (remainingDays >= daysInMonth) {
			remainingDays -= daysInMonth
			currentMonth++

			if (currentMonth > 12) {
				currentMonth = 1
				currentYear++
			}
		} else {
			currentDay = remainingDays + 1
			remainingDays = 0
		}
	}

	return hijriMoment(`${currentYear}-${currentMonth}-${currentDay}`, 'iYYYY-iM-iD')
		.utc()
		.add(3.5, 'hours')
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
