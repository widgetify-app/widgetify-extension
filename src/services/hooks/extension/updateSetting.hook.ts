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

export function useChangeWallpaper() {
	return useMutation<any, unknown, { wallpaperId: string | null }>({
		mutationFn: async ({ wallpaperId }) => {
			const client = await getMainClient()
			await client.put('/extension/@me/wallpaper', { wallpaperId })
		},
	})
}

export function useChangeTheme() {
	return useMutation<any, unknown, { theme: string }>({
		mutationFn: async ({ theme }) => {
			const client = await getMainClient()
			await client.put('/extension/@me/theme', { theme })
		},
	})
}
