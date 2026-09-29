import { describe, expect, it } from 'bun:test'
import { getDotGridLayout } from '../utils/get-dot-grid-layout'

describe('getDotGridLayout', () => {
	it('waits until the container has been measured', () => {
		expect(getDotGridLayout(365, 0, 0)).toBeNull()
		expect(getDotGridLayout(0, 200, 200)).toBeNull()
	})

	it('fits a whole year inside the box', () => {
		const width = 252
		const height = 148
		const layout = getDotGridLayout(365, width, height)
		if (!layout) throw new Error('expected a layout')

		const rows = Math.ceil(365 / layout.columns)
		expect(layout.columns * layout.cellSize).toBeLessThanOrEqual(width)
		expect(rows * layout.cellSize).toBeLessThanOrEqual(height)
	})

	it('uses more columns for a wider box', () => {
		const square = getDotGridLayout(365, 200, 200)
		const wide = getDotGridLayout(365, 500, 150)

		expect(wide?.columns).toBeGreaterThan(square?.columns ?? 0)
	})

	it('never uses more columns than there are dots', () => {
		expect(getDotGridLayout(3, 500, 50)?.columns).toBe(3)
	})

	it('keeps the dot smaller than its cell so the dots stay apart', () => {
		const layout = getDotGridLayout(30, 200, 120)

		expect(layout?.dotSize).toBeLessThan(layout?.cellSize ?? 0)
	})
})
