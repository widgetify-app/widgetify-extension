import { describe, expect, it } from 'bun:test'
import {
	WidgetKeys,
	compactLayout,
	DEFAULT_WIDGET_LAYOUT,
	findAvailableSlot,
	getCollisions,
	rectanglesOverlap,
	resolveLayoutChange,
	validateLayout,
} from '../index'
import type { StoredWidget } from '../types'

describe('Layout Engine Tests', () => {
	it('validates default layout without errors', () => {
		const isValid = validateLayout(DEFAULT_WIDGET_LAYOUT, 8)
		expect(isValid).toBe(true)
	})

	it('detects rectangle overlap correctly', () => {
		const a: StoredWidget = {
			id: WidgetKeys.search,
			instanceId: 'a',
			position: { col: 0, row: 0 },
			size: { w: 4, h: 2 },
		}
		const b: StoredWidget = {
			id: WidgetKeys.bookmarks,
			instanceId: 'b',
			position: { col: 2, row: 1 },
			size: { w: 4, h: 2 },
		}
		const c: StoredWidget = {
			id: WidgetKeys.clock,
			instanceId: 'c',
			position: { col: 4, row: 0 },
			size: { w: 2, h: 1 },
		}

		expect(rectanglesOverlap(a, b)).toBe(true)
		expect(rectanglesOverlap(a, c)).toBe(false)
		expect(getCollisions(a, [a, b, c])).toEqual([b])
	})

	it('pushes conflicting widget when resizing larger', () => {
		const initial: StoredWidget[] = [
			{
				id: WidgetKeys.weather,
				instanceId: 'weather',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 2 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'calendar',
				position: { col: 2, row: 0 },
				size: { w: 2, h: 2 },
			},
		]

		const result = resolveLayoutChange({
			layout: initial,
			operation: 'resize',
			instanceId: 'weather',
			targetSize: { w: 4, h: 2 },
			cols: 8,
		})

		expect(result).not.toBeNull()
		expect(validateLayout(result!, 8)).toBe(true)

		const weather = result!.find((w) => w.instanceId === 'weather')!
		const calendar = result!.find((w) => w.instanceId === 'calendar')!

		expect(weather.size).toEqual({ w: 4, h: 2 })
		expect(weather.position).toEqual({ col: 0, row: 0 })
		expect(rectanglesOverlap(weather, calendar)).toBe(false)
	})

	it('pushes recursively when moving a widget into occupied cells', () => {
		const initial: StoredWidget[] = [
			{
				id: WidgetKeys.search,
				instanceId: 'search',
				position: { col: 0, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks',
				position: { col: 0, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.wigiPad,
				instanceId: 'wigipad',
				position: { col: 0, row: 3 },
				size: { w: 2, h: 2 },
			},
		]

		const result = resolveLayoutChange({
			layout: initial,
			operation: 'move',
			instanceId: 'wigipad',
			targetPosition: { col: 0, row: 0 },
			cols: 8,
		})

		expect(result).not.toBeNull()
		expect(validateLayout(result!, 8)).toBe(true)

		const wigipad = result!.find((w) => w.instanceId === 'wigipad')!
		expect(wigipad.position).toEqual({ col: 0, row: 0 })
	})

	it('compacts layout removing vertical gaps', () => {
		const withGaps: StoredWidget[] = [
			{
				id: WidgetKeys.search,
				instanceId: 'search',
				position: { col: 0, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks',
				position: { col: 0, row: 5 },
				size: { w: 4, h: 2 },
			},
		]

		const compacted = compactLayout(withGaps, 8)
		const bookmarks = compacted.find((w) => w.instanceId === 'bookmarks')!
		expect(bookmarks.position.row).toBe(1)
	})

	it('finds available slots deterministically', () => {
		const layout: StoredWidget[] = [
			{
				id: WidgetKeys.search,
				instanceId: 'search',
				position: { col: 0, row: 0 },
				size: { w: 8, h: 1 },
			},
		]

		const slot = findAvailableSlot(layout, { w: 2, h: 2 }, 8)
		expect(slot).toEqual({ col: 0, row: 1 })
	})

	it('contains 9 widgets in the default layout matching the Advanced layout', () => {
		expect(DEFAULT_WIDGET_LAYOUT.length).toBe(9)
		const widgetIds = DEFAULT_WIDGET_LAYOUT.map((w) => w.id)
		expect(widgetIds).toContain(WidgetKeys.photo)
		expect(widgetIds).toContain(WidgetKeys.pet)
		expect(widgetIds).toContain(WidgetKeys.search)
		expect(widgetIds).toContain(WidgetKeys.bookmarks)
		expect(widgetIds).toContain(WidgetKeys.wigiPad)
		expect(widgetIds).toContain(WidgetKeys.calendar)
		expect(widgetIds).toContain(WidgetKeys.yadKar)
		expect(widgetIds).toContain(WidgetKeys.tools)
		expect(widgetIds).toContain(WidgetKeys.comboWidget)
	})

	it('validates Simple mode migration layout without overlaps', () => {
		const simpleLayout: StoredWidget[] = [
			{
				id: WidgetKeys.search,
				instanceId: 'search-default',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.wigiPad,
				instanceId: 'wigipad-default',
				position: { col: 0, row: 3 },
				size: { w: 2, h: 4 },
				meta: { variant: 'simplify' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-default',
				position: { col: 2, row: 5 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.tools,
				instanceId: 'tools-default',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 4 },
				meta: { variant: 'simplify' },
			},
		]
		expect(validateLayout(simpleLayout, 8)).toBe(true)
	})
})
