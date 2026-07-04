import { getMainClient } from '@/services/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { MiniAppsListResponse } from './mini-apps-interface'

interface GetMiniAppsParams {
	page?: number
	limit?: number
}

export const useGetMiniApps = ({ limit = 20 }: GetMiniAppsParams = {}) => {
	return useInfiniteQuery<MiniAppsListResponse>({
		queryKey: ['mini-apps', limit],
		queryFn: async ({ pageParam }) => {
			const api = getMainClient()
			const response = await api.get<MiniAppsListResponse>('/mini-apps/beta/list', {
				params: { page: pageParam, limit },
			})
			return response.data
		},
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			return currentPage < lastPage.data.totalPages ? currentPage + 1 : undefined
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	})
}
