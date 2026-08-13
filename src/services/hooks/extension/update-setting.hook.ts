import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Wallpaper } from '@/common/wallpaper.interface'

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
			const client = getMainClient()
			await client.patch('/extension/@me', data)
		},
	})
}

export function useChangeWallpaper() {
	return useMutation<any, unknown, { wallpaperId: string | null }>({
		mutationFn: async ({ wallpaperId }) => {
			const client = getMainClient()
			const response = await client.put<{ data: Wallpaper }>('/wallpapers/@me', {
				wallpaperId,
			})
			return response.data.data
		},
	})
}

export function useChangeTheme() {
	return useMutation<any, unknown, { theme: string }>({
		mutationFn: async ({ theme }) => {
			const client = getMainClient()
			await client.put('/extension/@me/theme', { theme })
		},
	})
}

export function useChangeBrowserTitle() {
	return useMutation<any, unknown, { browserTitleId: string }>({
		mutationFn: async ({ browserTitleId }) => {
			const client = getMainClient()
			await client.put('/extension/@me/browser-title', { browserTitleId })
		},
	})
}

export function useChangeFont() {
	return useMutation<any, unknown, { font: string }>({
		mutationFn: async ({ font }) => {
			const client = getMainClient()
			await client.put('/extension/@me/font', { font })
		},
	})
}

export function useChangeUI() {
	return useMutation<any, unknown, { ui: string }>({
		mutationFn: async ({ ui }) => {
			const client = getMainClient()
			await client.put('/extension/@me/ui', { ui })
		},
	})
}

export function useChangeSearchEngine() {
	return useMutation<any, unknown, { search_engine: string }>({
		mutationFn: async ({ search_engine }) => {
			const client = getMainClient()
			await client.put('/extension/@me/search-engine', { search_engine })
		},
	})
}

export function useUpdateSearchAutocomplete() {
	const queryClient = useQueryClient()

	return useMutation<any, unknown, { isActive: boolean }>({
		mutationFn: async ({ isActive }) => {
			const client = getMainClient()
			await client.put('/extension/@me/search-search-autocomplete', { isActive })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		},
	})
}
