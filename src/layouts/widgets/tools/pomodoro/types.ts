export type TimerMode = 'work' | 'short-break' | 'long-break'

export interface PomodoroSettings {
	workTime: number
	shortBreakTime: number
	longBreakTime: number
	cyclesBeforeLongBreak: number
}

export interface ThemeStyles {
	getTextStyle: () => string
	getInputStyle: () => string
	getSettingsPanelStyle: () => string
}

export interface PomodoroSession {
	startTime: number
	mode: TimerMode
	initialTimeLeft: number
	maxTime: number
	cycles: number
	isRunning: boolean
}

