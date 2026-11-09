import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage } from '@/common/storage'
import { installationId } from '@/common/utils/installation-id'
import { openLink } from '@/common/utils/open-link'
import { shouldAskForPush, shouldRegisterPush } from './utils/push-ask'
import { pushBlocked, registerPushToken } from './utils/push'
import { extensionKeys } from '@/services/extension/extension.keys'
import {
	markNotificationRead,
	putPushSubscription,
} from '@/services/push/push-subscription'
import { PushAsk } from './components/push-ask'
import { usePushActions } from './hooks/use-push-actions'
import { usePushState } from './hooks/use-push-state'
import { coldTap } from './utils/cold-tap'

async function register(): Promise<void> {
	const token = await registerPushToken()

	if (!token) return

	await putPushSubscription({
		installationId: await installationId(),
		token,
		platform: 'EXTENSION',
		appVersion: browser.runtime.getManifest().version,
	}).catch(() => {})
}

export function PushHost() {
	const queryClient = useQueryClient()
	const state = usePushState()
	const { turnOn } = usePushActions()
	const [laterAt, setLaterAt] = useState<number | null | undefined>(undefined)
	const [asking, setAsking] = useState(true)
	const { signedIn } = state

	useEffect(() => {
		getFromStorage('pushAskedAt').then((saved) => setLaterAt(saved ?? null))
	}, [])

	useEffect(() => {
		if (!signedIn) return

		const tap = coldTap(window.location.search)

		if (!tap) return

		window.history.replaceState(null, '', window.location.pathname)

		Analytics.event('push_tap')

		if (tap.notificationId) {
			markNotificationRead(tap.notificationId)
				.catch(() => {})
				.finally(() =>
					queryClient.invalidateQueries({
						queryKey: extensionKeys.notifications,
					})
				)
		}

		openLink(tap.link)
	}, [signedIn, queryClient])

	const wantsRegistration = shouldRegisterPush({ ...state, laterAt: null, now: 0 })

	useEffect(() => {
		if (state.ready && wantsRegistration) register()
	}, [state.ready, wantsRegistration])

	const ask =
		state.ready &&
		laterAt !== undefined &&
		asking &&
		!pushBlocked() &&
		shouldAskForPush({ ...state, laterAt, now: Date.now() })

	if (!ask) return null

	return (
		<PushAsk
			onAccept={() => turnOn().finally(() => setAsking(false))}
			onLater={() => setAsking(false)}
		/>
	)
}
