export const dateKeys = {
	events: ['get-events'] as const,
	googleCalendarEvents: (startDate: string, endDate?: string) =>
		['google-calendar-events', startDate, endDate] as const,
	religiousTime: (day: number, month: number, lat?: number, lon?: number) =>
		lon && lat
			? ['religiousTime', day, month, `${lat}-${lon}`]
			: ['religiousTime', day, month],
}
