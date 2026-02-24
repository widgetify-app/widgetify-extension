import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'

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
		dateTime: string
		timeZone: string
	}
	end: {
		dateTime: string
		timeZone: string
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

export interface GoogleCalendarResponse {
	events: GoogleCalendarEvent[]
}

const cache: Map<string, GoogleCalendarEvent[]> = new Map()

export const useGetGoogleCalendarEvents = (
	enabled: boolean,
	startDate: string,
	endDate?: string
) => {
	const startParam = startDate
	const endParam = endDate
	const cacheKey = `${startParam}-${endParam}`

	return useQuery<GoogleCalendarEvent[]>({
		queryKey: ['google-calendar-events', cacheKey],
		queryFn: async () => {
			if (cache.has(cacheKey)) {
				return cache.get(cacheKey) || []
			}

			const events = await getGoogleCalendarEvents(startParam, endParam)
			cache.set(cacheKey, events)
			return events
		},
		retry: 1,
		enabled: enabled,
	})
}

async function getGoogleCalendarEvents(
	startDate: string,
	endDate?: string
): Promise<GoogleCalendarEvent[]> {
	try {
		const client = await getMainClient()
		const { data } = await client.get<GoogleCalendarResponse>(
			`/google/events?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate ?? '')}`
		)
		return data.events || []
	} catch (error) {
		console.error('Error fetching Google Calendar events:', error)
		return []
	}
}
