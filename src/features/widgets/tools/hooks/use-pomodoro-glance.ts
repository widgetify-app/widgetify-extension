import { useEffect, useState } from 'react'
import { getFromStorage, watchStorage } from '@/common/storage'
import type { PomodoroSession, PomodoroSettings } from '../pomodoro/pomodoro'
import { pomodoroSecondsLeft } from '../utils/pomodoro-time'

export function usePomodoroGlance() {
	const [session, setSession] = useState<PomodoroSession | null>(null)
	const [settings, setSettings] = useState<PomodoroSettings | null>(null)
	const [now, setNow] = useState(Date.now())

	useEffect(() => {
		getFromStorage('pomodoro_session').then((value) => setSession(value ?? null))
		getFromStorage('pomodoro_settings').then((value) => setSettings(value ?? null))
		const stopSession = watchStorage('pomodoro_session', (value) =>
			setSession(value ?? null)
		)
		const stopSettings = watchStorage('pomodoro_settings', (value) =>
			setSettings(value ?? null)
		)
		return () => {
			stopSession()
			stopSettings()
		}
	}, [])

	const isRunning = Boolean(session?.isRunning)

	useEffect(() => {
		if (!isRunning) return
		const timer = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(timer)
	}, [isRunning])

	return { secondsLeft: pomodoroSecondsLeft(session, settings, now), isRunning }
}
