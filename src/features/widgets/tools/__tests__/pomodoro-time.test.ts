import { describe, expect, it } from 'bun:test'
import { formatTimer, pomodoroSecondsLeft, stepDuration } from '../utils/pomodoro-time'

const settings = {
	workTime: 30,
	shortBreakTime: 5,
	longBreakTime: 15,
	cyclesBeforeLongBreak: 4,
	alarmEnabled: true,
}

function session(isRunning: boolean) {
	return {
		startTime: 1_000_000,
		mode: 'work' as const,
		initialTimeLeft: 600,
		maxTime: 1500,
		cycles: 0,
		isRunning,
	}
}

describe('pomodoroSecondsLeft', () => {
	it('counts down a running session from when it started', () => {
		expect(pomodoroSecondsLeft(session(true), settings, 1_000_000 + 125_000)).toBe(
			475
		)
	})

	it('never goes below zero', () => {
		expect(pomodoroSecondsLeft(session(true), settings, 1_000_000 + 900_000)).toBe(0)
	})

	it('holds a paused session where it stopped', () => {
		expect(pomodoroSecondsLeft(session(false), settings, 9_999_999)).toBe(600)
	})

	it('starts from the saved work time, or 25 minutes', () => {
		expect(pomodoroSecondsLeft(null, settings, 0)).toBe(1800)
		expect(pomodoroSecondsLeft(null, null, 0)).toBe(1500)
	})
})

describe('formatTimer', () => {
	it('pads minutes and seconds', () => {
		expect(formatTimer(475)).toBe('07:55')
		expect(formatTimer(1500)).toBe('25:00')
	})
})

describe('stepDuration', () => {
	it('moves a whole step at a time', () => {
		expect(stepDuration(25, 5, 5, 90)).toBe(30)
		expect(stepDuration(25, -5, 5, 90)).toBe(20)
		expect(stepDuration(5, 1, 1, 30)).toBe(6)
	})

	it('snaps an odd stored value onto the steps', () => {
		expect(stepDuration(27, 5, 5, 90)).toBe(30)
		expect(stepDuration(27, -5, 5, 90)).toBe(25)
	})

	it('stops at the limits', () => {
		expect(stepDuration(90, 5, 5, 90)).toBe(90)
		expect(stepDuration(5, -5, 5, 90)).toBe(5)
		expect(stepDuration(1, -1, 1, 30)).toBe(1)
	})
})
