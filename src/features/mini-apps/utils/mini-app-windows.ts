import { getFromStorage, setToStorage } from '@/common/storage'
import type { MiniAppWindows } from '../types'
import { withoutWindow } from './without-window'

const POPUP_WIDTH = 480
const POPUP_HEIGHT = 760

async function isWindowAlive(windowId: number): Promise<boolean> {
	try {
		await browser.windows.get(windowId)
		return true
	} catch {
		return false
	}
}

export async function readLiveMiniAppWindows(): Promise<MiniAppWindows> {
	const stored = (await getFromStorage('miniAppWindows')) ?? {}
	const entries = await Promise.all(
		Object.entries(stored).map(
			async ([appId, windowId]) =>
				[appId, windowId, await isWindowAlive(windowId)] as const
		)
	)
	const live = Object.fromEntries(
		entries
			.filter(([, , alive]) => alive)
			.map(([appId, windowId]) => [appId, windowId])
	)
	if (Object.keys(live).length !== Object.keys(stored).length) {
		await setToStorage('miniAppWindows', live)
	}
	return live
}

export async function focusMiniAppWindow(windowId: number) {
	await browser.windows.update(windowId, { focused: true })
}

export async function openMiniAppWindow(appId: string) {
	const live = await readLiveMiniAppWindows()
	const existing = live[appId]
	if (existing !== undefined) {
		await focusMiniAppWindow(existing)
		return
	}

	await Promise.all(
		Object.values(live).map((windowId) => browser.windows.remove(windowId))
	)

	const url = `${browser.runtime.getURL('/mini-app.html')}?appId=${encodeURIComponent(appId)}`
	const created = await browser.windows.create({
		url,
		type: 'popup',
		width: POPUP_WIDTH,
		height: POPUP_HEIGHT,
	})
	if (created?.id === undefined) return

	await setToStorage('miniAppWindows', { [appId]: created.id })
}

export async function forgetMiniAppWindow(windowId: number) {
	const live = (await getFromStorage('miniAppWindows')) ?? {}
	await setToStorage('miniAppWindows', withoutWindow(live, windowId))
}
