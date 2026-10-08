import type { MiniAppWindows } from '../types'

export function withoutWindow(windows: MiniAppWindows, windowId: number): MiniAppWindows {
	return Object.fromEntries(Object.entries(windows).filter(([, id]) => id !== windowId))
}
