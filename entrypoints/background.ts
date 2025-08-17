import { io, type Socket } from 'socket.io-client'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import Analytics from '../src/analytics'
import { getFromStorage, setToStorage } from '../src/common/storage'

let socket: Socket | null = null

async function initializeSocket() {
	const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://api.widgetify.ir'

	if (socket) {
		socket.disconnect()
	}
	const token = await getFromStorage('auth_token')
	if (!token) return

	socket = io(socketUrl, {
		transports: ['websocket'],
		autoConnect: true,
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		query: {
			token,
		},
	})

	socket.on('connect', () => {
		console.log('Socket.IO connected with ID:', socket?.id)

		getFromStorage('auth_token').then((token) => {
			if (token) {
				socket?.emit('authenticate', { token })
			}
		})

		browser.runtime.sendMessage({ type: 'SOCKET_CONNECTED', socketId: socket?.id })
	})

	socket.on('disconnect', () => {
		console.log('Socket.IO disconnected')
		browser.runtime.sendMessage({ type: 'SOCKET_DISCONNECTED' })
	})

	socket.on('error', (error) => {
		console.error('Socket.IO error:', error)
		browser.runtime.sendMessage({ type: 'SOCKET_ERROR', error })
	})

	socket.on('message', (data) => {
		console.log('Socket.IO message received:', data)
		browser.runtime.sendMessage({ type: 'SOCKET_MESSAGE', data })
	})

	socket.on('notification', (data) => {
		browser.runtime.sendMessage({ type: 'SOCKET_NOTIFICATION', data })
	})
}

browser.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
	if (message.type === 'SOCKET_EMIT') {
		socket?.emit(message.event, message.data)
		return true
	}

	if (message.type === 'SOCKET_CONNECT') {
		await initializeSocket()
		return true
	}

	if (message.type === 'SOCKET_DISCONNECT') {
		socket?.disconnect()
		return true
	}

	if (message.type === 'SOCKET_STATUS_REQUEST') {
		sendResponse({
			isConnected: socket?.connected || false,
			socketId: socket?.id || null,
		})
		return true
	}

	return false
})

export default defineBackground(() => {
	const isDev = import.meta.env.DEV
	if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
		precacheAndRoute((self as any).__WB_MANIFEST)
	}

	initializeSocket()

	browser.action.onClicked.addListener(() => {
		browser.tabs.create({ url: browser.runtime.getURL('/newtab.html') })
		Analytics.featureUsed('IconClicked')
	})

	if (!isDev) {
		registerRoute(
			({ request }) => request.url.includes('api.widgetify.ir'),
			new NetworkFirst({
				cacheName: 'widgetify-api-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 100,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ request }) =>
				request.destination === 'script' ||
				request.destination === 'style' ||
				request.destination === 'font',
			new CacheFirst({
				cacheName: 'static-assets-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 200,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ request }) => request.destination === 'image',
			new CacheFirst({
				cacheName: 'images-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 300,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ request }) => request.destination === 'document',
			new NetworkFirst({
				cacheName: 'html-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ url }) =>
				url.origin === 'https://cdn.jsdelivr.net' ||
				url.origin === 'https://unpkg.com' ||
				url.origin === 'https://cdnjs.cloudflare.com' ||
				url.hostname.includes('googleapis.com') ||
				url.hostname.includes('gstatic.com') ||
				url.hostname.includes('storage'),
			new StaleWhileRevalidate({
				cacheName: 'cdn-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 100,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ url, request }) =>
				url.origin !== self.location.origin &&
				!url.hostname.includes('widgetify.ir') &&
				request.method === 'GET',
			new StaleWhileRevalidate({
				cacheName: 'cross-origin-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		const navigationRoute = new NavigationRoute(
			new NetworkFirst({
				cacheName: 'navigation-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 30,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
					}),
				],
			})
		)
		registerRoute(navigationRoute)
	}

	browser.runtime.onInstalled.addListener(async (details) => {
		if (details.reason === 'install') {
			await setToStorage('showWelcomeModal', true)

			const manifest = browser.runtime.getManifest()

			Analytics.featureUsed('Installed', {
				version: manifest.version,
				offlineSupport: true,
			})

			isDev && (await preloadCriticalResources())
		} else if (details.reason === 'update') {
			const manifest = browser.runtime.getManifest()
			const previousVersion = details.previousVersion || 'unknown'

			Analytics.featureUsed('Updated', {
				version: manifest.version,
				previousVersion,
				offlineSupport: true,
			})

			await cleanupOutdatedCaches()
			await preloadCriticalResources()
		}
	})

	browser.runtime.onStartup.addListener(async () => {
		Analytics.featureUsed('Startup')
	})

	cleanupOutdatedCaches()
})

async function preloadCriticalResources() {
	try {
		const cache = await caches.open('critical-resources-v1')

		const criticalUrls = ['/newtab.html'].filter(Boolean)

		if (criticalUrls.length > 0) {
			await cache.addAll(criticalUrls)
			console.log('Critical resources preloaded for offline use')
		}
	} catch (error) {
		console.error('Failed to preload critical resources:', error)
	}
}
