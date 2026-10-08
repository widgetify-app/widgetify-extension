import { v4 as uuidv4 } from 'uuid'
import { getFromStorage, setToStorage } from '@/common/storage'

const GA_MEASUREMENT_ID = 'G-7Z0R61E5BZ'
const GA_API_SECRET = 'mqy2svrEQOu-qC-K4yxJdw'
const SESSION_EXPIRY_MS = 30 * 60 * 1000
const SESSION_PERSIST_INTERVAL_MS = 60 * 1000

function isSessionActive(lastActivity: number, now: number): boolean {
	return Number.isFinite(lastActivity) && now - lastActivity < SESSION_EXPIRY_MS
}

function shouldPersistSession(persistedAt: number, now: number): boolean {
	return (
		!Number.isFinite(persistedAt) || now - persistedAt >= SESSION_PERSIST_INTERVAL_MS
	)
}

interface CachedSession {
	id: string
	lastActivity: number
	persistedAt: number
}

let cachedClientId: Promise<string> | null = null
let cachedSession: CachedSession | null = null
let sessionLoad: Promise<CachedSession> | null = null

async function loadClientId(): Promise<string> {
	const data = await getFromStorage('gaClientId')
	if (data?.ga_client_id) return data.ga_client_id

	const clientId = uuidv4()
	await setToStorage('gaClientId', { ga_client_id: clientId })
	return clientId
}

function getClientId(): Promise<string> {
	if (!cachedClientId) {
		cachedClientId = loadClientId().catch((error) => {
			cachedClientId = null
			throw error
		})
	}
	return cachedClientId
}

async function loadSession(now: number): Promise<CachedSession> {
	const stored = await getFromStorage('analyticsSession')
	const storedActivity = stored?.timestamp
		? new Date(stored.timestamp).getTime()
		: Number.NaN

	if (stored?.session_id && isSessionActive(storedActivity, now)) {
		return { id: stored.session_id, lastActivity: now, persistedAt: storedActivity }
	}
	return { id: uuidv4(), lastActivity: now, persistedAt: Number.NaN }
}

async function getSessionId(): Promise<string> {
	const now = Date.now()

	if (!cachedSession || !isSessionActive(cachedSession.lastActivity, now)) {
		sessionLoad ??= loadSession(now).finally(() => {
			sessionLoad = null
		})
		cachedSession = await sessionLoad
	}

	const session = cachedSession
	session.lastActivity = now

	if (shouldPersistSession(session.persistedAt, now)) {
		session.persistedAt = now
		await setToStorage('analyticsSession', {
			session_id: session.id,
			timestamp: new Date(now).toISOString(),
		})
	}
	return session.id
}

const Analytics = (() => {
	async function pageView(pageTitle: string, pagePath: string): Promise<void> {
		const setting = await getFromStorage('generalSettings')
		if (setting?.disable_analytics || setting?.analyticsEnabled === false) return
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
		if (setting?.disable_analytics || setting?.analyticsEnabled === false) {
			console.log('Analytics disabled, skipping event:', eventName)
			return
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

	async function error(errorMessage: string, errorSource: string): Promise<void> {
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
