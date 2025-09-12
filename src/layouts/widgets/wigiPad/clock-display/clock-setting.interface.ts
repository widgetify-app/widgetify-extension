export interface ClockSettings {
	clockType: ClockType
	showSeconds: boolean
	showTimeZone: boolean
}
export enum ClockType {
	Analog = 'analog',
	Digital = 'digital',
}
