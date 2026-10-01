import { describe, expect, it } from 'bun:test'
import { getCanvasHeight, getWidgetPixelRect } from '../utils/grid-geometry'
import type { StoredWidget } from '../utils/layout-engine/types'

function widget(row: number, h: number): StoredWidget {
	return { position: { col: 0, row }, size: { w: 1, h } } as StoredWidget
}

describe('getWidgetPixelRect', () => {
	it('places a widget by its cell and the gap between cells', () => {
		expect(
			getWidgetPixelRect({ col: 2, row: 1 }, { w: 2, h: 3 }, 100, 50, 10)
		).toEqual({
			left: 220,
			top: 60,
			width: 210,
			height: 170,
		})
	})

	it('has no gap to add for a one cell widget', () => {
		expect(
			getWidgetPixelRect({ col: 0, row: 0 }, { w: 1, h: 1 }, 100, 50, 10)
		).toEqual({
			left: 0,
			top: 0,
			width: 100,
			height: 50,
		})
	})
})

describe('getCanvasHeight', () => {
	it('is zero for an empty canvas', () => {
		expect(getCanvasHeight([], 50, 10)).toBe(0)
	})

	it('is one cell high for one row, with no gap to add', () => {
		expect(getCanvasHeight([widget(0, 1)], 50, 10)).toBe(50)
	})

	it('reaches the bottom of the lowest widget, with a gap between rows', () => {
		expect(getCanvasHeight([widget(0, 2)], 50, 10)).toBe(110)
		expect(getCanvasHeight([widget(0, 1), widget(3, 2)], 50, 10)).toBe(
			5 * 50 + 4 * 10
		)
	})
})
