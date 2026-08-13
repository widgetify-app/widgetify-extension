export interface ClockSettings {
	clockType: ClockType
	showSeconds: boolean
	showTimeZone: boolean
	useSelectedFont: boolean
}
export enum ClockType {
	Analog = 'analog',
	Digital = 'digital',
}
