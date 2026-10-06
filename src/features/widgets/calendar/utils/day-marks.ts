import {
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
	type WidgetifyDate,
} from '@/common/utils/date-events'
import type { FetchedAllEvents } from '@/services/date/get-events.hook'

const FRIDAY = 5

interface DayMarks {
	isHoliday: boolean
	isHolidayEvent: boolean
	hasEvent: boolean
	eventCount: number
}

export function getDayMarks(events: FetchedAllEvents, date: WidgetifyDate): DayMarks {
	const shamsi = getShamsiEvents(events, date)
	const hijri = getHijriEvents(events, date)
	const gregorian = getGregorianEvents(events, date)
	const isHolidayEvent = [...shamsi, ...hijri].some((event) => event.isHoliday)

	return {
		isHoliday: date.day() === FRIDAY || isHolidayEvent,
		isHolidayEvent,
		hasEvent:
			shamsi.length > 0 ||
			[...gregorian, ...hijri].some((event) => Boolean(event.icon)),
		eventCount: shamsi.length,
	}
}
