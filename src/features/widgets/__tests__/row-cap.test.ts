import { describe, expect, it } from 'bun:test'
import { PRESET_LAYOUTS } from '../presets/constants'
import { DEFAULT_WIDGET_LAYOUT, MAX_CANVAS_ROWS } from '../utils/layout-engine/constants'
import { resolveLayoutChange } from '../utils/layout-engine/layout-engine'
import { rowCapFor } from '../utils/layout-engine/row-cap'
import type { StoredWidget } from '../utils/layout-engine/types'
import { WidgetKeys } from '../utils/layout-engine/types'

function clock(instanceId: string, row: number): StoredWidget {
	return {
		id: WidgetKeys.clock,
		instanceId,
		position: { col: 0, row },
		size: { w: 2, h: 1 },
	}
}

function bottom(layout: StoredWidget[]): number {
	return Math.max(...layout.map((w) => w.position.row + w.size.h))
}

describe('row cap', () => {
	it('scales with the column count so a reflowed layout still fits', () => {
		expect(rowCapFor(8)).toBe(MAX_CANVAS_ROWS)
		expect(rowCapFor(4)).toBe(MAX_CANVAS_ROWS * 2)
	})

	it('leaves room for the default layout and every preset', () => {
		expect(bottom(DEFAULT_WIDGET_LAYOUT)).toBeLessThanOrEqual(MAX_CANVAS_ROWS)
		for (const preset of PRESET_LAYOUTS) {
			expect(bottom(preset.widgets)).toBeLessThanOrEqual(MAX_CANVAS_ROWS)
		}
	})

	it('allows a move down to the last row and refuses one past it', () => {
		const layout = [clock('a', 0)]
		const move = (row: number) =>
			resolveLayoutChange({
				layout,
				operation: 'move',
				instanceId: 'a',
				targetPosition: { col: 0, row },
				cols: 8,
			})
		expect(move(MAX_CANVAS_ROWS - 1)).not.toBeNull()
		expect(move(MAX_CANVAS_ROWS)).toBeNull()
	})

	it('refuses a move that pushes another widget past the last row', () => {
		const layout = [clock('a', 0), clock('b', MAX_CANVAS_ROWS - 1)]
		const result = resolveLayoutChange({
			layout,
			operation: 'move',
			instanceId: 'a',
			targetPosition: { col: 0, row: MAX_CANVAS_ROWS - 1 },
			cols: 8,
		})
		expect(result).toBeNull()
	})

	it('refuses to add a widget when the only free slot is past the last row', () => {
		const full: StoredWidget[] = Array.from(
			{ length: MAX_CANVAS_ROWS * 4 },
			(_, i) => ({
				id: WidgetKeys.clock,
				instanceId: `w${i}`,
				position: { col: (i % 4) * 2, row: Math.floor(i / 4) },
				size: { w: 2, h: 1 },
			})
		)
		const result = resolveLayoutChange({
			layout: full,
			operation: 'add',
			newWidget: clock('new', 0),
			cols: 8,
		})
		expect(result).toBeNull()
	})

	it('still lets a layout that is already too tall move a widget back up', () => {
		const layout = [clock('a', 0), clock('low', 30)]
		const result = resolveLayoutChange({
			layout,
			operation: 'move',
			instanceId: 'low',
			targetPosition: { col: 2, row: 0 },
			cols: 8,
		})
		expect(result).not.toBeNull()
	})
})
