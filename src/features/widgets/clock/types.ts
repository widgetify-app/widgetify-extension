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

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		clock: ClockSettings
	}
}

declare module '@/common/utils/call-event' {
	interface EventName {
		clockSettingsChanged: ClockSettings
	}
}
