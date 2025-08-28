import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface PomodoroSession {
	duration: number
	mode: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
	startTime: string
	endTime: string
	status: 'COMPLETED'
}

export function useCreatePomodoroSession() {
	return useMutation({
		mutationFn: async (data: PomodoroSession) => {
			const api = await getMainClient()
			await api.post('/pomodoro/session', data)
		},
	})
}
