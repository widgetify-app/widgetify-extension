import { useQueryClient } from '@tanstack/react-query'
import Analytics from '@/analytics'
import { installationId } from '@/common/utils/installation-id'
import { enablePush } from '../utils/push'
import { deletePushSubscription } from '@/services/push/push-subscription'
import { useSetPushPreference } from '@/services/push/push-preferences.hook'
import { pushKeys } from '@/services/push/push.keys'

export function usePushActions() {
	const queryClient = useQueryClient()
	const { mutateAsync: setPreference } = useSetPushPreference()

	async function turnOn(): Promise<boolean> {
		const granted = await enablePush()

		await queryClient.invalidateQueries({ queryKey: pushKeys.enabledHere })

		if (!granted) {
			Analytics.event('push_denied')

			return false
		}

		await setPreference(true).catch(() => {})
		Analytics.event('push_turned_on')

		return true
	}

	async function turnOff(): Promise<void> {
		await setPreference(false).catch(() => {})
		await deletePushSubscription(await installationId()).catch(() => {})
		Analytics.event('push_turned_off')
	}

	return { turnOn, turnOff }
}
