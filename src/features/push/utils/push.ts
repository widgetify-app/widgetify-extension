const FIREBASE_CONFIG = {
	apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY ?? ''),
	appId: String(import.meta.env.VITE_FIREBASE_APP_ID ?? ''),
	projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ''),
	messagingSenderId: String(import.meta.env.VITE_FIREBASE_SENDER_ID ?? ''),
}

const VAPID_KEY = String(import.meta.env.VITE_VAPID_KEY ?? '')

function configured(): boolean {
	return VAPID_KEY.length > 0 && Object.values(FIREBASE_CONFIG).every(Boolean)
}

export function pushAvailable(): boolean {
	return (
		!import.meta.env.FIREFOX &&
		configured() &&
		'Notification' in globalThis &&
		'serviceWorker' in navigator
	)
}

export function pushBlocked(): boolean {
	return 'Notification' in globalThis && Notification.permission === 'denied'
}

export async function pushEnabledHere(): Promise<boolean> {
	return pushAvailable() && Notification.permission === 'granted'
}

export function enablePush(): Promise<boolean> {
	return Notification.requestPermission()
		.then((answer) => answer === 'granted')
		.catch(() => false)
}

export async function registerPushToken(): Promise<string | null> {
	try {
		const [{ initializeApp }, { getMessaging, getToken }] = await Promise.all([
			import('firebase/app'),
			import('firebase/messaging'),
		])

		const registration = await navigator.serviceWorker.ready

		const token = await getToken(getMessaging(initializeApp(FIREBASE_CONFIG)), {
			vapidKey: VAPID_KEY,
			serviceWorkerRegistration: registration,
		})

		return token || null
	} catch {
		return null
	}
}
