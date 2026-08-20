import { getFromStorage, setToStorage } from '@/common/storage'
import { DEFAULT_WIDGET_LAYOUT } from './layout-engine'
import type { StoredWidget } from './layout-engine/types'

export async function migrateWidgetLayoutIfNeeded(): Promise<StoredWidget[]> {
	const existingStored = await getFromStorage('storedWidgets')

	if (Array.isArray(existingStored) && existingStored.length > 0) {
		return existingStored
	}

	await setToStorage('storedWidgets', DEFAULT_WIDGET_LAYOUT)
	return DEFAULT_WIDGET_LAYOUT
}
