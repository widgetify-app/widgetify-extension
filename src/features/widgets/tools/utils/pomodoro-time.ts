import type { PomodoroSession, PomodoroSettings } from '../pomodoro/pomodoro'

const DEFAULT_WORK_SECONDS = 25 * 60

export function formatTimer(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function pomodoroSecondsLeft(
	session: PomodoroSession | null,
	settings: PomodoroSettings | null,
	nowMs: number
): number {
	if (session?.isRunning) {
		const elapsed = Math.floor((nowMs - session.startTime) / 1000)
		return Math.max(0, session.initialTimeLeft - elapsed)
	}
	if (session) return session.initialTimeLeft
	return settings ? settings.workTime * 60 : DEFAULT_WORK_SECONDS
}

export function stepDuration(
	value: number,
	step: number,
	min: number,
	max: number
): number {
	const size = Math.abs(step)
	const next =
		step > 0
			? (Math.floor(value / size) + 1) * size
			: (Math.ceil(value / size) - 1) * size
	return Math.min(max, Math.max(min, next))
}
