import { getFromStorage, setToStorage } from '@/common/storage'
import {
	compactLayout,
	DEFAULT_WIDGET_LAYOUT,
	validateLayout,
} from './layout-engine'
import type { StoredWidget } from './layout-engine/types'

export const MIGRATION_VERSION_KEY = 'widgetLayoutMigrationVersion'
export const CURRENT_MIGRATION_VERSION = 5

export async function migrateWidgetLayoutIfNeeded(): Promise<StoredWidget[]> {
	const version = await getFromStorage('widgetLayoutMigrationVersion')
	const existingStored = await getFromStorage('storedWidgets')

	if (
		version &&
		version >= CURRENT_MIGRATION_VERSION &&
		existingStored &&
		existingStored.length > 0
	) {
		if (validateLayout(existingStored, 8)) {
			return existingStored
		}
	}

	const finalLayout = compactLayout([...DEFAULT_WIDGET_LAYOUT], 8)

	await Promise.all([
		setToStorage('storedWidgets', finalLayout),
		setToStorage('widgetLayoutMigrationVersion', CURRENT_MIGRATION_VERSION),
	])

	return finalLayout
}
