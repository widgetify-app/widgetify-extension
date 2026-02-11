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
		if (import.meta.env.FIREFOX) {
			const privacyConfig = localStorage.getItem('wxt_local:allowAnalytics')
			if (privacyConfig !== 'true') {
				return
			}
		}
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
		eventParams: Record<string, any> = {}
	): Promise<void> {
		const setting = await getFromStorage('generalSettings')
		if (setting?.disable_analytics) {
			console.log('Analytics disabled, skipping event:', eventName)
			return
		}

		if (import.meta.env.FIREFOX) {
			const privacyConfig = localStorage.getItem('wxt_local:allowAnalytics')
			if (privacyConfig !== 'true') {
				return
			}
		}

		const clientId = await getClientId()
		const sessionId = await getSessionId()

		const payload = {
			client_id: clientId,
			events: [
				{
					name: eventName,
					params: { ...eventParams, session_id: sessionId },
				},
			],
		}

		sendMeasurementEvent(payload)
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

		if (import.meta.env.FIREFOX) {
			const privacyConfig = localStorage.getItem('wxt_local:allowAnalytics')
			if (privacyConfig !== 'true') {
				return
			}
		}

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
		}).catch()
	}

	return {
		pageView,
		event,
		error,
	}
})()

export default Analytics
