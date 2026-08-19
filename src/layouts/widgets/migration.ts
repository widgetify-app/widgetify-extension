import { getFromStorage, setToStorage } from '@/common/storage'
import {
	compactLayout,
	DEFAULT_WIDGET_LAYOUT,
	findAvailableSlot,
	validateLayout,
} from './layout-engine'
import { type StoredWidget, WidgetKeys } from './layout-engine/types'
import { WIDGET_DEFINITIONS } from './widget-registry'

export const MIGRATION_VERSION_KEY = 'widgetLayoutMigrationVersion'
export const CURRENT_MIGRATION_VERSION = 1

export async function migrateWidgetLayoutIfNeeded(): Promise<StoredWidget[]> {
	const version = await getFromStorage('widgetLayoutMigrationVersion')
	const existingStored = await getFromStorage('storedWidgets')

	if (version && version >= CURRENT_MIGRATION_VERSION && existingStored && existingStored.length > 0) {
		if (validateLayout(existingStored, 8)) {
			return existingStored
		}
	}

	const legacyActive = await getFromStorage('activeWidgets')

	let candidateLayout: StoredWidget[] = []

	if (legacyActive && Array.isArray(legacyActive) && legacyActive.length > 0) {
		candidateLayout = [
			{
				id: WidgetKeys.widgetify,
				instanceId: 'widgetify-default',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'search-default',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-default',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.wigiPad,
				instanceId: 'wigipad-default',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 3 },
			},
		]

		const sortedLegacy = [...legacyActive].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0)
		)

		for (const item of sortedLegacy) {
			const id = item.id as WidgetKeys
			if (
				id === WidgetKeys.widgetify ||
				id === WidgetKeys.search ||
				id === WidgetKeys.bookmarks ||
				id === WidgetKeys.wigiPad
			) {
				continue
			}

			const def = WIDGET_DEFINITIONS[id]
			const size = def?.defaultSize || { w: 2, h: 2 }
			const slot = findAvailableSlot(candidateLayout, size, 8)

			candidateLayout.push({
				id,
				instanceId: `${id}-default`,
				position: slot,
				size,
			})
		}
	} else {
		candidateLayout = [...DEFAULT_WIDGET_LAYOUT]
	}

	const finalLayout = compactLayout(candidateLayout, 8)

	await Promise.all([
		setToStorage('storedWidgets', finalLayout),
		setToStorage('widgetLayoutMigrationVersion', CURRENT_MIGRATION_VERSION),
	])

	return finalLayout
}
