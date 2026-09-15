import type { FetchedAllEvents } from '@/services/hooks/date/get-events.hook'

export const EMPTY_EVENTS: FetchedAllEvents = {
	gregorianEvents: [],
	hijriEvents: [],
	shamsiEvents: [],
}
