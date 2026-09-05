import { getMultipleFromStorage, getFromStorage, setToStorage } from '@/common/storage'
import { DEFAULT_WIDGET_LAYOUT } from './layout-engine'
import { type StoredWidget, WidgetKeys } from './layout-engine/types'

const DEFAULT_BOTTOM_WIDGETS: WidgetKeys[] = [
	WidgetKeys.comboWidget,
	WidgetKeys.yadKar,
	WidgetKeys.tools,
	WidgetKeys.calendar,
]

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
		id: WidgetKeys.photo,
		instanceId: 'photo-default',
		position: { col: 6, row: 0 },
		size: { w: 2, h: 2 },
		widgetId: 'photo-default',
	},
	{
		id: WidgetKeys.pet,
		instanceId: 'pet-default',
		position: { col: 6, row: 2 },
		size: { w: 2, h: 1 },
		widgetId: 'pet-default',
	},
]

export function replaceWidgetifyWithPetAndPhoto(widgets: StoredWidget[]): {
	layout: StoredWidget[]
	hasChanged: boolean
} {
	let hasChanged = false
	const result: StoredWidget[] = []

	for (const widget of widgets) {
		if (widget.id === WidgetKeys.widgetify) {
			hasChanged = true
			const col = widget.position?.col ?? 6
			const baseRow = widget.position?.row ?? 0

			result.push({
				id: WidgetKeys.photo,
				instanceId: 'photo-default',
				position: { col, row: baseRow },
				size: { w: 2, h: 2 },
				widgetId: 'photo-default',
			})

			result.push({
				id: WidgetKeys.pet,
				instanceId: 'pet-default',
				position: { col, row: baseRow + 2 },
				size: { w: 2, h: 1 },
				widgetId: 'pet-default',
			})
		} else {
			result.push(widget)
		}
	}

	return { layout: result, hasChanged }
}

export async function migrateWidgetLayoutIfNeeded(): Promise<StoredWidget[]> {
	const existingStored = await getFromStorage('storedWidgets')

	if (Array.isArray(existingStored)) {
		const { layout, hasChanged } = replaceWidgetifyWithPetAndPhoto(existingStored)
		if (hasChanged) {
			await setToStorage('storedWidgets', layout)
		}
		return layout
	}

	const { appearance, activeWidgets } = await getMultipleFromStorage([
		'appearance',
		'activeWidgets',
	])

	let migratedLayout: StoredWidget[] = []

	if (appearance?.ui === 'SIMPLE') {
		const availableHeight =
			typeof window !== 'undefined' ? window.innerHeight - 80 : 600
		const unitH = 96 + 8
		const totalRows = Math.max(6, Math.floor(availableHeight / unitH))
		const bottomStartRow = Math.max(1, totalRows - 3)

		migratedLayout = [
			{
				id: WidgetKeys.search,
				instanceId: 'search-default',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'clock-default',
				position: { col: 0, row: bottomStartRow },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'moodtracker-default',
				position: { col: 0, row: bottomStartRow + 1 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'calendar-default',
				position: { col: 1, row: bottomStartRow + 1 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'habittracker-default',
				position: { col: 0, row: bottomStartRow + 2 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-default',
				position: { col: 2, row: bottomStartRow + 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.yadKar,
				instanceId: 'yadkar-default',
				position: { col: 6, row: bottomStartRow },
				size: { w: 2, h: 3 },
			},
		]
	} else {
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
