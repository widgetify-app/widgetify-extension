import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'
import { dateKeys } from '@/services/date/date.keys'

export interface GoogleCalendarEvent {
	kind: string
	id: string
	status: string
	htmlLink: string
	created: string
	updated: string
	summary: string
	location?: string
	creator: {
		email: string
		self: boolean
	}
	organizer: {
		email: string
		self: boolean
	}
	start: {
		dateTime?: string
		date?: string
		timeZone?: string
	}
	end: {
		dateTime?: string
		date?: string
		timeZone?: string
	}
	iCalUID: string
	sequence: number
	reminders: {
		useDefault: boolean
	}
	eventType: string
	hangoutLink?: string
	attendees?: {
		email: string
		responseStatus: string
		organizer?: boolean
		self?: boolean
	}[]
	conferenceData?: {
		entryPoints: {
			entryPointType: string
			uri: string
			label: string
		}[]
		conferenceSolution: {
			key: {
				type: string
			}
			name: string
			iconUri: string
		}
		conferenceId: string
	}
}

interface GoogleCalendarResponse {
	events: GoogleCalendarEvent[]
}

const STALE_TIME_MS = 5 * 60 * 1000

export const useGetGoogleCalendarEvents = (
	enabled: boolean,
	startDate: string,
	endDate?: string
) => {
	return useQuery<GoogleCalendarEvent[]>({
		queryKey: dateKeys.googleCalendarEvents(startDate, endDate),
		queryFn: async () => getGoogleCalendarEvents(startDate, endDate),
		retry: 1,
		staleTime: STALE_TIME_MS,
		enabled: enabled,
	})
}

async function getGoogleCalendarEvents(
	startDate: string,
	endDate?: string
): Promise<GoogleCalendarEvent[]> {
	const client = getMainClient()
	const { data } = await client.get<GoogleCalendarResponse>(
		`/google/events?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate ?? '')}`
	)
	return data.events || []
}
