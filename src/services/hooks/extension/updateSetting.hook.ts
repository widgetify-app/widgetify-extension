import { useMutation } from '@tanstack/react-query'
import type { FontFamily } from '@/context/appearance.context'
import { getMainClient } from '@/services/api'

export interface UpdateExtensionSettingsInput {
	pet?: string | null
	petName?: string | null
	font?: FontFamily
	theme?: string
	timeZone?: string
	wallpaperId?: string
}

export function useUpdateExtensionSettings() {
	return useMutation<any, unknown, UpdateExtensionSettingsInput>({
		mutationFn: async (data: UpdateExtensionSettingsInput) => {
			const client = await getMainClient()
			await client.patch('/extension/@me', data)
		},
	})
}
