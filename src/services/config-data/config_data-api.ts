import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

export interface ExtensionConfigResponse {
	logo: {
		id: string
		logoUrl: string | null
		content: string | null
	}
}

export async function getConfigData(): Promise<ExtensionConfigResponse> {
	const api = await getMainClient()

	const result = await api.get<ExtensionConfigResponse>('/extension')

	return result.data
}

export async function useGetConfigData() {
	return useQuery<ExtensionConfigResponse>({
		queryKey: ['extension-config'],
		queryFn: getConfigData,
		gcTime: 1000 * 60 * 5, // 5 minutes
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}
