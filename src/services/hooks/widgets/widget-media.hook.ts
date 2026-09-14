import { getMainClient, safeAwait } from '@/services/api'
import type { AxiosError } from 'axios'

export interface UploadWidgetMediaResponse {
	url: string
}

export async function uploadWidgetMediaApi(
	instanceId: string,
	file: File
): Promise<UploadWidgetMediaResponse> {
	const client = getMainClient()
	const formData = new FormData()
	formData.append('file', file)

	const response = await client.post<UploadWidgetMediaResponse>(
		`/user-widgets/${instanceId}/media`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)

	return response.data
}

export async function removeWidgetMediaApi(instanceId: string): Promise<boolean> {
	const client = getMainClient()
	const [error] = await safeAwait<AxiosError, { success: boolean }>(
		client.delete(`/user-widgets/${instanceId}/media`)
	)
	return !error
}
