import { describe, expect, it } from 'bun:test'
import {
	STACK_GAP,
	STACK_VISIBLE_LAYERS,
	getStackAnchor,
	getStackLayer,
	getStackScale,
	getStackShift,
} from '../utils/stack-geometry'

const bottomEdge = (layer: number, height: number, tallest: number) =>
	getStackShift(layer, height, tallest) + height * getStackScale(layer)

const heightMixes = [
	[68, 68, 68, 68],
	[68, 87, 68, 87],
	[87, 68, 68, 68],
	[68, 200, 52, 87],
]

describe('getStackAnchor', () => {
	it('maps each position to the edge its stack is pinned to', () => {
		expect(getStackAnchor('top-center')).toBe('center')
		expect(getStackAnchor('bottom-center')).toBe('center')
		expect(getStackAnchor('top-right')).toBe('right')
		expect(getStackAnchor('top-left')).toBe('left')
	})
})

describe('getStackShift', () => {
	it('leaves the front card untouched', () => {
		expect(getStackShift(0, 68, 68)).toBe(0)
		expect(getStackShift(0, 120, 68)).toBe(0)
	})

	it('falls back to a plain cascade until heights are measured', () => {
		expect(getStackShift(2, undefined, 68)).toBe(2 * STACK_GAP)
		expect(getStackShift(2, 68, undefined)).toBe(2 * STACK_GAP)
	})

	it('peeks exactly one gap per layer when the cards match in height', () => {
		for (let layer = 1; layer <= STACK_VISIBLE_LAYERS; layer++) {
			expect(bottomEdge(layer, 68, 68) - 68).toBeCloseTo(layer * STACK_GAP, 6)
		}
	})

	it('drops every bottom edge exactly one gap below the one in front', () => {
		for (const heights of heightMixes) {
			const tallest = Math.max(...heights)
			for (let layer = 1; layer < heights.length; layer++) {
				expect(bottomEdge(layer, heights[layer], tallest)).toBeCloseTo(
					tallest + layer * STACK_GAP,
					6
				)
			}
		}
	})

	it('never lifts a card above the front one, however the heights mix', () => {
		for (const heights of heightMixes) {
			const tallest = Math.max(...heights)
			for (let layer = 1; layer < heights.length; layer++) {
				expect(getStackShift(layer, heights[layer], tallest)).toBeGreaterThan(0)
			}
		}
	})
})

describe('getStackLayer', () => {
	it('parks every card past the visible layers on the back one', () => {
		expect(getStackLayer(0)).toBe(0)
		expect(getStackLayer(STACK_VISIBLE_LAYERS)).toBe(STACK_VISIBLE_LAYERS)
		expect(getStackLayer(19)).toBe(STACK_VISIBLE_LAYERS)
	})

	it('keeps the scale positive for every layer it produces', () => {
		expect(getStackScale(getStackLayer(19))).toBeGreaterThan(0)
	})
})
