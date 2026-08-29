import { getMultipleFromStorage, getFromStorage, setToStorage } from '@/common/storage'
import { DEFAULT_WIDGET_LAYOUT } from './layout-engine'
import { type StoredWidget, WidgetKeys } from './layout-engine/types'

const DEFAULT_BOTTOM_WIDGETS: WidgetKeys[] = [
	WidgetKeys.comboWidget,
	WidgetKeys.yadKar,
	WidgetKeys.tools,
	WidgetKeys.calendar,
]

export async function migrateWidgetLayoutIfNeeded(): Promise<StoredWidget[]> {
	const existingStored = await getFromStorage('storedWidgets')

	if (Array.isArray(existingStored) && existingStored.length > 0) {
		return existingStored
	}

	const { appearance, activeWidgets } = await getMultipleFromStorage([
		'appearance',
		'activeWidgets',
	])

	let migratedLayout: StoredWidget[] = []

	if (appearance?.ui === 'SIMPLE') {
		migratedLayout = [
			{
				id: WidgetKeys.search,
				instanceId: 'search-default',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.yadKar,
				instanceId: 'yadkar-default',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'clock-default',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-default',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'moodtracker-default',
				position: { col: 6, row: 1 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'calendar-default',
				position: { col: 7, row: 1 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'habittracker-default',
				position: { col: 6, row: 2 },
				size: { w: 2, h: 1 },
			},
		]
	} else {
		const topWidgets: StoredWidget[] = [
			{
				id: WidgetKeys.wigiPad,
				instanceId: 'wigipad-default',
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
				id: WidgetKeys.widgetify,
				instanceId: 'widgetify-default',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 3 },
			},
		]

		let bottomKeys: WidgetKeys[] = DEFAULT_BOTTOM_WIDGETS

		if (Array.isArray(activeWidgets) && activeWidgets.length > 0) {
			const validKeys = Object.values(WidgetKeys)
			const extracted = [...activeWidgets]
				.filter((w) => validKeys.includes(w?.id))
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
				.map((w) => w.id as WidgetKeys)

			if (extracted.length > 0) {
				bottomKeys = extracted
			}
		}

		const bottomWidgets: StoredWidget[] = bottomKeys.map((key, index) => ({
			id: key,
			instanceId: `${key}-default`,
			position: {
				col: (index % 4) * 2,
				row: 3 + Math.floor(index / 4) * 3,
			},
			size: { w: 2, h: 3 },
		}))

		migratedLayout = [...topWidgets, ...bottomWidgets]
	}

	const finalLayout = migratedLayout.length > 0 ? migratedLayout : DEFAULT_WIDGET_LAYOUT

	await setToStorage('storedWidgets', finalLayout)

	if (appearance) {
		await setToStorage('appearance', {
			...appearance,
			ui: 'CUSTOM',
		})
	}

	return finalLayout
}
