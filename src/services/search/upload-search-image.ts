import { getMainClient } from '@/services/api'

export async function uploadSearchImage(
	file: File,
	onProgress: (percent: number) => void
): Promise<{ url: string }> {
	const formData = new FormData()
	formData.append('image', file)

	const response = await getMainClient().post('/users/@me/upload/search', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		onUploadProgress: (progressEvent) => {
			onProgress(
				Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
			)
		},
	})

	return response.data
}
