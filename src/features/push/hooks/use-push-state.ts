import { useQuery } from '@tanstack/react-query'
import { pushAvailable, pushEnabledHere } from '../utils/push'
import { useAuth } from '@/context/auth.context'
import { usePushPreference } from '@/services/push/push-preferences.hook'
import { pushKeys } from '@/services/push/push.keys'

export function usePushState() {
	const { isAuthenticated } = useAuth()
	const available = pushAvailable()
	const here = useQuery({
		queryKey: pushKeys.enabledHere,
		queryFn: pushEnabledHere,
		enabled: available,
	})
	const preference = usePushPreference(available && isAuthenticated)

	return {
		available,
		signedIn: isAuthenticated,
		enabledHere: here.data ?? false,
		preferenceOn: preference.data ?? false,
		ready: here.isSuccess && preference.isSuccess,
	}
}
