import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import type { SingleMiniApp } from './mini-apps.interface'
import { miniAppsKeys } from '@/services/mini-apps/mini-apps.keys'

interface GetMiniAppResponse {
	data: SingleMiniApp
}

export const useGetMiniApp = (appId: string) => {
	return useQuery<GetMiniAppResponse>({
		queryKey: miniAppsKeys.one(appId),
		queryFn: async () => {
			const api = getMainClient()
			const { data } = await api.get<GetMiniAppResponse>(
				`/mini-apps/beta/app-id/${appId}`
			)
			return data
		},
		enabled: !!appId,
		staleTime: 5 * 60 * 1000,
	})
}
