import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { pushKeys } from './push.keys'

interface PreferencesReply {
	data?: { pushEnabled?: unknown }
}

function readPushEnabled(reply: PreferencesReply | null | undefined): boolean {
	return reply?.data?.pushEnabled !== false
}

export function usePushPreference(enabled: boolean) {
	return useQuery({
		queryKey: pushKeys.preferences,
		enabled,
		queryFn: async () => {
			const { data } = await getMainClient().get<PreferencesReply>(
				'/v2/notifications/preferences'
			)

			return readPushEnabled(data)
		},
	})
}

export function useSetPushPreference() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: pushKeys.updatePreferences,
		mutationFn: async (pushEnabled: boolean) => {
			const { data } = await getMainClient().patch<PreferencesReply>(
				'/v2/notifications/preferences',
				{ pushEnabled }
			)

			return readPushEnabled(data)
		},
		onSuccess: (pushEnabled) => {
			queryClient.setQueryData(pushKeys.preferences, pushEnabled)
		},
	})
}
