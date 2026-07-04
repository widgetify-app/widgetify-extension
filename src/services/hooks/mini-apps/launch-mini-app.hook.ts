import { getMainClient } from '@/services/api'
import { useMutation } from '@tanstack/react-query'
import type { MiniAppLaunchResponse } from './mini-apps-interface'

export const useLaunchMiniApp = () => {
	return useMutation<MiniAppLaunchResponse, Error, { appId: string }>({
		mutationFn: async ({ appId }) => {
			const api = getMainClient()
			const { data } = await api.post<MiniAppLaunchResponse>(
				'/mini-apps/beta/launch',
				{
					appId,
				}
			)
			return data
		},
	})
}
