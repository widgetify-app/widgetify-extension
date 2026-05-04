import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { MiniApp } from './mini-apps-interface'

interface GetMiniAppResponse {
	data: MiniApp
}

export const useGetMiniApp = (appId: string) => {
	return useQuery<GetMiniAppResponse>({
		queryKey: ['mini-app', appId],
		queryFn: async () => {
			const api = await getMainClient()
			const { data } = await api.get<GetMiniAppResponse>(
				`/mini-apps/beta/app-id/${appId}`
			)
			return data
		},
		enabled: !!appId,
		staleTime: 5 * 60 * 1000,
	})
}
