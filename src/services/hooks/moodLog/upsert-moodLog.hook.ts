import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const MoodType = {
	sad: 'sad',
	normal: 'normal',
	happy: 'happy',
	excited: 'excited',
}
export type MoodType = keyof typeof MoodType
export interface MoodLogCreateInput {
	mood: MoodType
	date: string // "2025-12-31", !NOTE: date can't be in the future or past more than 7 days
}

export function useUpsertMoodLog() {
	return useMutation({
		mutationKey: ['upsertMoodLog'],
		mutationFn: async (data: MoodLogCreateInput) => {
			const api = await getMainClient()
			const response = await api.put('/users/@me/moods', data)
			return response.data
		},
	})
}
