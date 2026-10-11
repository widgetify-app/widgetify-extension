import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface PartnerLaunchResponse {
	widgetUrl: string
	origin: string
	data: string
	signature: string
	timeoutMs: number | null
}

export const useLaunchPartnerWidget = () => {
	return useMutation<PartnerLaunchResponse, unknown, { instanceId: string }>({
		mutationFn: async ({ instanceId }) => {
			const client = getMainClient()
			const { data } = await client.post<PartnerLaunchResponse>(
				`/user-widgets/${instanceId}/launch`
			)

			return data
		},
	})
}
