import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const usePartnerConsent = () => {
	return useMutation<{ consented: true }, unknown, { widgetKey: string }>({
		mutationFn: async ({ widgetKey }) => {
			const client = getMainClient()
			const { data } = await client.post<{ consented: true }>(
				'/user-widgets/partner-consent',
				{ widgetKey }
			)

			return data
		},
	})
}
