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
	startDate?: Date,
	endDate?: Date
) => {
	const today = new Date()
	const defaultStartDate =
		startDate || new Date(today.getFullYear(), today.getMonth(), 1)
	const defaultEndDate =
		endDate || new Date(today.getFullYear(), today.getMonth() + 1, 0)

	const formatDateParam = (date: Date) => {
		return date.toISOString().split('T')[0]
	}

	const startParam = formatDateParam(defaultStartDate)
	const endParam = formatDateParam(defaultEndDate)
	const cacheKey = `${startParam}-${endParam}`

	return useQuery<GoogleCalendarEvent[]>({
		queryKey: ['google-calendar-events', startParam, endParam],
		queryFn: async () => {
			if (cache.has(cacheKey)) {
				return cache.get(cacheKey) || []
			}

			const events = await getGoogleCalendarEvents(startParam, endParam)
			cache.set(cacheKey, events)
			return events
		},
		retry: 1,
		// initialData: cache.get(cacheKey) || [],
		enabled: enabled,
	})
}

async function getGoogleCalendarEvents(
	startDate: string,
	endDate: string
): Promise<GoogleCalendarEvent[]> {
	try {
		const client = await getMainClient()
		const { data } = await client.get<GoogleCalendarResponse>(
			`/google/events?start=${startDate}&end=${endDate}`
		)

		return data.events || []
	} catch (error) {
		console.error('Error fetching Google Calendar events:', error)
		return []
	}
}
