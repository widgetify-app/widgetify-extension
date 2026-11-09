import { installationId } from '@/common/utils/installation-id'
import { getMainClient } from '@/services/api'

const SIGN_OUT_WAIT_MS = 3000

interface PushSubscriptionBody {
	installationId: string
	token: string
	platform: 'EXTENSION'
	appVersion: string
}

export async function putPushSubscription(body: PushSubscriptionBody): Promise<void> {
	await getMainClient().put('/v2/push/subscriptions', body)
}

export async function deletePushSubscription(installationId: string): Promise<void> {
	await getMainClient().delete(
		`/v2/push/subscriptions/${encodeURIComponent(installationId)}`
	)
}

export async function forgetPushSubscription(): Promise<void> {
	const removing = installationId()
		.then(deletePushSubscription)
		.catch(() => {})

	const giveUp = new Promise<void>((resolve) => setTimeout(resolve, SIGN_OUT_WAIT_MS))

	await Promise.race([removing, giveUp])
}

export async function markNotificationRead(id: string): Promise<void> {
	await getMainClient().post('/v2/notifications/read', { ids: [id] })
}
