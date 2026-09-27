import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { moodLogKeys } from '@/services/mood-log/mood-log.keys'

export const MoodType = {
	sad: 'sad',
	normal: 'normal',
	happy: 'happy',
	excited: 'excited',
}
export type MoodType = keyof typeof MoodType
interface MoodLogCreateInput {
	mood: MoodType
	date: string // "2025-12-31", !NOTE: date can't be in the future or past more than 7 days
}

export function useUpsertMoodLog() {
	return useMutation({
		mutationKey: moodLogKeys.upsert,
		mutationFn: async (data: MoodLogCreateInput) => {
			const api = getMainClient()
			const response = await api.put('/users/@me/moods', data)
			return response.data
		},
	})
}
