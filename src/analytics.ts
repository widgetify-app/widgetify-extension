import { v4 as uuidv4 } from 'uuid'
import { getFromStorage, setToStorage } from './common/storage'

const GA_MEASUREMENT_ID = 'G-7Z0R61E5BZ'
const GA_API_SECRET = 'mqy2svrEQOu-qC-K4yxJdw'
async function getClientId(): Promise<string> {
	const data = await getFromStorage('gaClientId')

	let clientId: string
	if (data?.ga_client_id) {
		clientId = data.ga_client_id
	} else {
		clientId = uuidv4()
		await setToStorage('gaClientId', { ga_client_id: clientId })
	}

	return clientId
}

const Analytics = (() => {
	async function pageView(pageTitle: string, pagePath: string): Promise<void> {
		const setting = await getFromStorage('generalSettings')
		if (setting?.disable_analytics) return

		const clientId = await getClientId()

		const payload = {
			client_id: clientId,
			events: [
				{
					name: 'page_view',
					params: {
						page_title: pageTitle,
						page_location: pagePath,
					},
				},
			],
		}

		sendMeasurementEvent(payload)
	}

	async function event(
		eventName: string,
		eventParams: Record<string, any> = {},
	): Promise<void> {
		const setting = await getFromStorage('generalSettings')
		if (setting?.disable_analytics) {
			console.log('Analytics disabled, skipping event:', eventName)
			return
		}

		const clientId = await getClientId()

		const payload = {
			client_id: clientId,
			events: [
				{
					name: eventName,
					params: eventParams,
				},
			],
		}

		sendMeasurementEvent(payload)
	}

	async function featureUsed(
		featureName: string,
		details: Record<string, any> = {},
		actionType: 'view' | 'click' | 'toggle' | 'input' | 'other' = 'other',
	): Promise<void> {
		const enhancedDetails = {
			action_type: actionType,
			timestamp: new Date().toISOString(),
			session_id: await getSessionId(),
			...details,
		}

		await event(featureName, enhancedDetails)
	}

	async function getSessionId(): Promise<string> {
		const sessionData = await getFromStorage('analyticsSession')
		const SESSION_EXPIRY = 30 * 60 * 1000 // 30 minutes

		if (sessionData?.session_id && sessionData?.timestamp) {
			const lastActivity = new Date(sessionData.timestamp).getTime()
			const now = Date.now()

			if (now - lastActivity < SESSION_EXPIRY) {
				await setToStorage('analyticsSession', {
					session_id: sessionData.session_id,
					timestamp: new Date().toISOString(),
				})
				return sessionData.session_id
			}
		}

		const newSessionId = uuidv4()
		await setToStorage('analyticsSession', {
			session_id: newSessionId,
			timestamp: new Date().toISOString(),
		})
		return newSessionId
	}

	async function error(errorMessage: string, errorSource: string): Promise<void> {
		const setting = await getFromStorage('generalSettings')
		if (setting?.disable_analytics) return

		await event('error', {
			error_message: errorMessage,
			error_source: errorSource,
		})
	}

	function sendMeasurementEvent(payload: any): void {
		if (import.meta.env.DEV) {
			console.log('in dev mode, skipping analytics:', payload)
			return
		}

		const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload),
		}).catch((err) => console.error('Analytics error:', err))
	}

	return {
		pageView,
		event,
		featureUsed,
		error,
	}
})()

export default Analytics
