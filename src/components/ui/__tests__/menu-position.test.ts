import { describe, expect, it } from 'bun:test'
import { fitMenuHorizontally, fitMenuVertically } from '../utils/menu-position'

describe('fitMenuVertically', () => {
	it('keeps the menu below its anchor when it fits', () => {
		expect(
			fitMenuVertically({
				top: 100,
				flipBottom: 90,
				height: 300,
				viewportHeight: 800,
			})
		).toBe(100)
	})

	it('opens above the anchor when there is no room below', () => {
		expect(
			fitMenuVertically({
				top: 620,
				flipBottom: 600,
				height: 360,
				viewportHeight: 800,
			})
		).toBe(240)
	})

	it('pins to the bottom edge when neither side has room', () => {
		expect(
			fitMenuVertically({
				top: 300,
				flipBottom: 280,
				height: 500,
				viewportHeight: 600,
			})
		).toBe(88)
	})

	it('never goes above the top edge', () => {
		expect(
			fitMenuVertically({
				top: 200,
				flipBottom: 180,
				height: 900,
				viewportHeight: 600,
			})
		).toBe(12)
	})
})

describe('fitMenuHorizontally', () => {
	it('keeps a menu that fits where it is', () => {
		expect(fitMenuHorizontally(300, 228, 1000)).toBe(300)
	})

	it('pulls a menu back from the right edge', () => {
		expect(fitMenuHorizontally(900, 228, 1000)).toBe(760)
	})

	it('pulls a menu back from the left edge', () => {
		expect(fitMenuHorizontally(-40, 228, 1000)).toBe(12)
	})
})
