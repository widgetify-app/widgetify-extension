import { notificationOf, pushDataOf, tapUrl } from './push-notification'

interface PushEvent {
	data: { json(): unknown } | null
	waitUntil(work: Promise<unknown>): void
}

interface ClickEvent {
	notification: { close(): void; data?: Record<string, string> }
	waitUntil(work: Promise<unknown>): void
}

interface Worker {
	registration: { showNotification(title: string, options: object): Promise<void> }
	clients: { openWindow(url: string): Promise<unknown> }
	addEventListener(type: 'push', listener: (event: PushEvent) => void): void
	addEventListener(
		type: 'notificationclick',
		listener: (event: ClickEvent) => void
	): void
}

const worker = self as unknown as Worker

function readPayload(event: PushEvent): unknown {
	try {
		return event.data?.json()
	} catch {
		return null
	}
}

export function setupPush() {
	if (import.meta.env.FIREFOX) return

	worker.addEventListener('push', (event) => {
		const { title, options } = notificationOf(
			pushDataOf(readPayload(event)),
			browser.runtime.getURL('/icons/icon128.png')
		)

		event.waitUntil(worker.registration.showNotification(title, options))
	})

	worker.addEventListener('notificationclick', (event) => {
		event.notification.close()

		event.waitUntil(
			worker.clients.openWindow(
				tapUrl(
					browser.runtime.getURL('/newtab.html'),
					event.notification.data ?? {}
				)
			)
		)
	})
}
