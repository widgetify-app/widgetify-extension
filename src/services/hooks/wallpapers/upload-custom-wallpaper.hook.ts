import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Wallpaper } from '@/common/wallpaper.interface'

export async function uploadCustomWallpaperApi(file: File): Promise<Wallpaper> {
	const client = getMainClient()
	const formData = new FormData()
	formData.append('file', file)

	const response = await client.post<{ data: Wallpaper }>(
		'/wallpapers/@me/custom',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)
	return response.data.data
}

export async function removeCustomWallpaperApi(): Promise<void> {
	const client = getMainClient()
	await client.delete('/wallpapers/@me/custom')
}

export function useUploadCustomWallpaper() {
	const queryClient = useQueryClient()

	return useMutation<Wallpaper, unknown, File>({
		mutationFn: (file: File) => uploadCustomWallpaperApi(file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		},
	})
}

export function useRemoveCustomWallpaper() {
	const queryClient = useQueryClient()

	return useMutation<void, unknown, void>({
		mutationFn: () => removeCustomWallpaperApi(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		},
	})
}
