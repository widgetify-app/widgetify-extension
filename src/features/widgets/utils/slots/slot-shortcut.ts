import { SLOT_WORKSPACES } from './slot-access'

interface ShortcutKey {
	code: string
	altKey: boolean
	ctrlKey: boolean
	metaKey: boolean
	shiftKey: boolean
	repeat: boolean
}

export function slotShortcutIndex(event: ShortcutKey): number | null {
	if (!event.altKey || !(event.ctrlKey || event.metaKey)) return null
	if (event.shiftKey || event.repeat) return null

	const match = /^(?:Digit|Numpad)([1-9])$/.exec(event.code)
	if (!match) return null

	const index = Number(match[1]) - 1
	return index < SLOT_WORKSPACES.length ? index : null
}
