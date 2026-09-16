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
			{ id: WidgetKeys.todos, order: 2 },
			{ id: WidgetKeys.calendar, order: 1 },
			{ id: 'unknown-widget', order: 0 },
		]

		const result = await migrateWidgetLayoutIfNeeded()

		expect(validateLayout(result, 8)).toBe(true)

		const topWidgetKeys = [
			WidgetKeys.clock,
			WidgetKeys.moodTracker,
			WidgetKeys.weather,
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
			WidgetKeys.todos,
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

	it('migrates classic layout with more than 4 active widgets across multiple rows', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }
		storageMockData.activeWidgets = [
			{ id: WidgetKeys.calendar, order: 0 },
			{ id: WidgetKeys.yadKar, order: 1 },
			{ id: WidgetKeys.tools, order: 2 },
			{ id: WidgetKeys.comboWidget, order: 3 },
			{ id: WidgetKeys.arzLive, order: 4 },
			{ id: WidgetKeys.news, order: 5 },
		]

		const result = await migrateWidgetLayoutIfNeeded()

		expect(validateLayout(result, 8)).toBe(true)

		const arzLiveWidget = result.find((w) => w.id === WidgetKeys.arzLive)
		const newsWidget = result.find((w) => w.id === WidgetKeys.news)

		expect(arzLiveWidget).toBeDefined()
		expect(newsWidget).toBeDefined()
		expect(arzLiveWidget?.position.row).toBe(6)
		expect(arzLiveWidget?.position.col).toBe(6)
		expect(newsWidget?.position.row).toBe(6)
		expect(newsWidget?.position.col).toBe(4)
	})

	it('handles corrupt or empty storage gracefully falling back to default layout', async () => {
		storageMockData.storedWidgets = null
		storageMockData.appearance = null
		storageMockData.activeWidgets = null

		const result = await migrateWidgetLayoutIfNeeded()

		expect(result.length).toBeGreaterThan(0)
		expect(validateLayout(result, 8)).toBe(true)
		expect(storageMockData.storedWidgets).toEqual(result)
	})

	it('persists migrated layout and marks appearance as CUSTOM', async () => {
		storageMockData.appearance = { ui: 'CLASSIC', otherSetting: 123 }
		storageMockData.activeWidgets = [{ id: WidgetKeys.calendar, order: 0 }]

		await migrateWidgetLayoutIfNeeded()

		expect(storageMockData.appearance.ui).toBe('CUSTOM')
		expect(storageMockData.appearance.otherSetting).toBe(123)
		expect(Array.isArray(storageMockData.storedWidgets)).toBe(true)
	})

	it('filters out invalid or deprecated widget keys in activeWidgets during migration', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }
		storageMockData.activeWidgets = [
			{ id: 'non_existent_widget_key_xyz', order: 0 },
			{ id: WidgetKeys.calendar, order: 2 },
			{ id: null, order: 3 },
			{ order: 4 },
			{ id: WidgetKeys.notes, order: 5 },
		]

		const result = await migrateWidgetLayoutIfNeeded()

		expect(validateLayout(result, 8)).toBe(true)
		const invalidWidget = result.find(
			(w) => w.id === ('non_existent_widget_key_xyz' as any)
		)
		expect(invalidWidget).toBeUndefined()

		const calendarWidget = result.find((w) => w.id === WidgetKeys.calendar)
		const notesWidget = result.find((w) => w.id === WidgetKeys.notes)

		expect(calendarWidget).toBeDefined()
		expect(notesWidget).toBeDefined()
		// In RTL: index 0 (calendar) -> col 6, row 3
		expect(calendarWidget?.position).toEqual({ col: 6, row: 3 })
		// In RTL: index 1 (notes) -> col 4, row 3
		expect(notesWidget?.position).toEqual({ col: 4, row: 3 })
	})

	it('preserves top widgets (search, clock, moodTracker, photo, pet) alongside migrated active widgets', async () => {
		storageMockData.appearance = { ui: 'CLASSIC' }
		storageMockData.activeWidgets = [
			{ id: WidgetKeys.weather, order: 0 },
			{ id: WidgetKeys.notes, order: 1 },
		]

		const result = await migrateWidgetLayoutIfNeeded()

		const search = result.find((w) => w.id === WidgetKeys.search)
		const clock = result.find(
			(w) => w.id === WidgetKeys.clock && w.position.row === 0
		)
		const mood = result.find((w) => w.id === WidgetKeys.moodTracker)
		const photo = result.find((w) => w.id === WidgetKeys.photo)
		const pet = result.find((w) => w.id === WidgetKeys.pet)

		expect(search).toBeDefined()
		expect(clock).toBeDefined()
		expect(mood).toBeDefined()
		expect(photo).toBeDefined()
		expect(pet).toBeDefined()

		expect(search?.position).toEqual({ col: 2, row: 0 })
		expect(search?.size).toEqual({ w: 4, h: 1 })
		expect(clock?.position).toEqual({ col: 0, row: 0 })
		expect(mood?.position).toEqual({ col: 0, row: 1 })
		expect(photo?.position).toEqual({ col: 6, row: 0 })
		expect(pet?.position).toEqual({ col: 6, row: 2 })

		const weather = result.find(
			(w) => w.id === WidgetKeys.weather && w.position.row === 3
		)
		const notes = result.find(
			(w) => w.id === WidgetKeys.notes && w.position.row === 3
		)
		// In RTL: index 0 (weather) -> col 6, index 1 (notes) -> col 4
		expect(weather?.position).toEqual({ col: 6, row: 3 })
		expect(notes?.position).toEqual({ col: 4, row: 3 })
	})
})
