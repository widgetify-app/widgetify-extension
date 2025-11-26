import { useMutation } from '@tanstack/react-query'
import type { FontFamily } from '@/context/appearance.context'
import { getMainClient } from '@/services/api'

export interface UpdateExtensionSettingsInput {
	pet?: string | null
	petName?: string | null
	font?: any
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
			await client.put('/wallpapers/@me', { wallpaperId })
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

export function useChangeBrowserTitle() {
	return useMutation<any, unknown, { browserTitleId: string }>({
		mutationFn: async ({ browserTitleId }) => {
			const client = await getMainClient()
			await client.put('/extension/@me/browser-title', { browserTitleId })
		},
	})
}

export function useChangeFont() {
	return useMutation<any, unknown, { font: FontFamily }>({
		mutationFn: async ({ font }) => {
			const client = await getMainClient()
			await client.put('/extension/@me/font', { font })
		},
	})
}
