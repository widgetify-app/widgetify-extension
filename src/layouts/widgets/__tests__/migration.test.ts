import { describe, expect, it } from 'bun:test'
import { validateLayout } from '../layout-engine/validation'
import { type StoredWidget, WidgetKeys } from '../layout-engine/types'

// @ts-expect-error
const { mock, beforeEach } = await import('bun:test')

const storageMockData: Record<string, any> = {}

mock.module('@/common/storage', () => ({
	getFromStorage: async (key: string) => storageMockData[key] ?? null,
	getMultipleFromStorage: async (keys: string[]) => {
		const result: Record<string, any> = {}
		for (const k of keys) {
			if (k in storageMockData) {
				result[k] = storageMockData[k]
			}
		}
		return result
	},
	setToStorage: async (key: string, value: any) => {
		storageMockData[key] = value
	},
}))

const { migrateWidgetLayoutIfNeeded } = await import('../migration')

describe('migrateWidgetLayoutIfNeeded', () => {
	beforeEach(() => {
		for (const key of Object.keys(storageMockData)) {
			delete storageMockData[key]
		}
	})

	it('returns existing storedWidgets directly without modification', async () => {
		const existing: StoredWidget[] = [
			{
				id: WidgetKeys.clock,
				instanceId: 'custom-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
			},
		]
		storageMockData.storedWidgets = existing

		const result = await migrateWidgetLayoutIfNeeded()

		expect(result).toEqual(existing)
		expect(storageMockData.storedWidgets).toEqual(existing)
	})

	it('migrates Simple UI mode into a valid, non-overlapping custom layout', async () => {
		storageMockData.appearance = { ui: 'SIMPLE' }

		const result = await migrateWidgetLayoutIfNeeded()

		expect(result.length).toBeGreaterThan(0)
		expect(validateLayout(result, 8)).toBe(true)

		const ids = result.map((w) => w.id)
		expect(ids).toContain(WidgetKeys.search)
		expect(ids).toContain(WidgetKeys.clock)
		expect(ids).toContain(WidgetKeys.moodTracker)
		expect(ids).toContain(WidgetKeys.calendar)
		expect(ids).toContain(WidgetKeys.HabitTracker)
		expect(ids).toContain(WidgetKeys.bookmarks)
		expect(ids).toContain(WidgetKeys.yadKar)

		expect(storageMockData.appearance.ui).toBe('CUSTOM')
		expect(storageMockData.storedWidgets).toEqual(result)
	})

	it('migrates classic layout using activeWidgets with custom order', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }
		storageMockData.activeWidgets = [
			{ id: WidgetKeys.weather, order: 2 },
			{ id: WidgetKeys.calendar, order: 1 },
			{ id: 'unknown-widget', order: 0 },
		]

		const result = await migrateWidgetLayoutIfNeeded()

		expect(validateLayout(result, 8)).toBe(true)

		const topWidgetKeys = [
			WidgetKeys.wigiPad,
			WidgetKeys.search,
			WidgetKeys.bookmarks,
			WidgetKeys.photo,
			WidgetKeys.pet,
		]
		for (const key of topWidgetKeys) {
			expect(result.some((w) => w.id === key)).toBe(true)
		}

		const bottomWidgets = result.filter((w) => !topWidgetKeys.includes(w.id))
		expect(bottomWidgets.map((w) => w.id)).toEqual([
			WidgetKeys.calendar,
			WidgetKeys.weather,
		])

		expect(storageMockData.appearance.ui).toBe('CUSTOM')
	})

	it('migrates classic layout using default bottom widgets when activeWidgets is empty', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }
		storageMockData.activeWidgets = []

		const result = await migrateWidgetLayoutIfNeeded()

		expect(validateLayout(result, 8)).toBe(true)

		const bottomWidgetIds = result.filter((w) => w.position.row >= 3).map((w) => w.id)

		expect(bottomWidgetIds).toContain(WidgetKeys.comboWidget)
		expect(bottomWidgetIds).toContain(WidgetKeys.yadKar)
		expect(bottomWidgetIds).toContain(WidgetKeys.tools)
		expect(bottomWidgetIds).toContain(WidgetKeys.calendar)
	})

	it('ensures each migrated widget has unique instanceId and valid in-bounds position', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }

		const result = await migrateWidgetLayoutIfNeeded()

		const instanceIds = result.map((w) => w.instanceId)
		expect(new Set(instanceIds).size).toBe(instanceIds.length)

		for (const widget of result) {
			expect(widget.position.col).toBeGreaterThanOrEqual(0)
			expect(widget.position.col + widget.size.w).toBeLessThanOrEqual(8)
			expect(widget.position.row).toBeGreaterThanOrEqual(0)
		}
	})
})
