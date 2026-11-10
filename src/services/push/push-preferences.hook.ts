import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWithExpiry, setWithExpiry } from '@/common/storage'
import { getMainClient } from '@/services/api'
import { cachedAnswer } from './cached-answer'
import { pushKeys } from './push.keys'

const PREFERENCE_CACHE_MINUTES = 6 * 60

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
		queryFn: () =>
			cachedAnswer({
				read: () => getWithExpiry('pushPreference'),
				load: async () => {
					const { data } = await getMainClient().get<PreferencesReply>(
						'/v2/notifications/preferences'
					)

					return readPushEnabled(data)
				},
				save: (value) =>
					setWithExpiry('pushPreference', value, PREFERENCE_CACHE_MINUTES),
			}),
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
			setWithExpiry('pushPreference', pushEnabled, PREFERENCE_CACHE_MINUTES)
		},
	})
}
