import { getMainClient } from '@/services/api'

interface UploadWidgetMediaResponse {
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
