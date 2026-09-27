export interface ClockSettings {
	clockType: ClockType
	showSeconds: boolean
	showTimeZone: boolean
	useSelectedFont: boolean
}

enum ClockType {
	Analog = 'analog',
	Digital = 'digital',
}
