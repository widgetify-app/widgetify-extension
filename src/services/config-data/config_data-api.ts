import { getMainClient } from '../api'

export interface ExtensionConfigResponse {
	logo: {
		id: string
		url: string | null
		content: string | null
	}
}

export async function getConfigData(): Promise<ExtensionConfigResponse> {
	const api = await getMainClient()

	const result = await api.get<ExtensionConfigResponse>('/extension')

	return result.data
}
