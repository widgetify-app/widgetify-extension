export type TimerMode = 'work' | 'short-break'

export interface PomodoroSettings {
	workTime: number
	shortBreakTime: number
	longBreakTime: number
	cyclesBeforeLongBreak: number
	alarmEnabled: boolean
}

export interface PomodoroSession {
	startTime: number
	mode: TimerMode
	initialTimeLeft: number
	maxTime: number
	cycles: number
	isRunning: boolean
}

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		pomodoro_session: PomodoroSession | null
		pomodoro_settings: PomodoroSettings | null
	}
}
