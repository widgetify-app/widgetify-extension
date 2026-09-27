import type { FetchedAllEvents } from '@/services/date/get-events.hook'

export const EMPTY_EVENTS: FetchedAllEvents = {
	gregorianEvents: [],
	hijriEvents: [],
	shamsiEvents: [],
}
