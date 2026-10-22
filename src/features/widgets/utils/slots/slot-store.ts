import { getFromStorage, setToStorage, watchStorage } from '@/common/storage'
import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'
import type { WidgetSlot } from '../../types'
import { normalizeActiveSlot, normalizeSlots } from './normalize-slots'

export async function loadSlots(): Promise<WidgetSlot[]> {
	return normalizeSlots(await getFromStorage('widgetSlots'))
}

export function saveSlots(slots: WidgetSlot[]) {
	return setToStorage('widgetSlots', slots)
}

export async function loadActiveSlot(): Promise<WidgetWorkspace> {
	return normalizeActiveSlot(await getFromStorage('activeWidgetSlot'))
}

export function saveActiveSlot(workspace: WidgetWorkspace) {
	return setToStorage('activeWidgetSlot', workspace)
}

export function watchSlots(onChange: (slots: WidgetSlot[]) => void) {
	return watchStorage('widgetSlots', (value) => onChange(normalizeSlots(value)))
}

export function watchActiveSlot(onChange: (workspace: WidgetWorkspace) => void) {
	return watchStorage('activeWidgetSlot', (value) =>
		onChange(normalizeActiveSlot(value))
	)
}
