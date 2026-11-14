import { describe, expect, it } from 'bun:test'
import { advanceFlakes, createFlakes, FLAKE_SIZE, FLAKE_SPEED } from '../utils/snow-field'

const sequence = (values: number[]) => {
	let index = 0

	return () => values[index++ % values.length]
}

describe('createFlakes', () => {
	it('makes the asked number of flakes inside the size, speed and position ranges', () => {
		const flakes = createFlakes(16, 2, Math.random)

		expect(flakes).toHaveLength(16)

		for (const flake of flakes) {
			expect(flake.x).toBeGreaterThanOrEqual(0)
			expect(flake.x).toBeLessThan(1)
			expect(flake.y).toBeGreaterThanOrEqual(0)
			expect(flake.y).toBeLessThan(1)
			expect(flake.size).toBeGreaterThanOrEqual(FLAKE_SIZE[0])
			expect(flake.size).toBeLessThanOrEqual(FLAKE_SIZE[1])
			expect(flake.speed).toBeGreaterThanOrEqual(FLAKE_SPEED[0])
			expect(flake.speed).toBeLessThanOrEqual(FLAKE_SPEED[1])
			expect([0, 1]).toContain(flake.sprite)
		}
	})

	it('picks every sprite index below the sprite count', () => {
		const flakes = createFlakes(40, 3, Math.random)

		expect(Math.max(...flakes.map((flake) => flake.sprite))).toBeLessThan(3)
	})

	it('is repeatable with the same random source', () => {
		const first = createFlakes(4, 2, sequence([0.1, 0.5, 0.9]))
		const second = createFlakes(4, 2, sequence([0.1, 0.5, 0.9]))

		expect(first).toEqual(second)
	})
})

describe('advanceFlakes', () => {
	it('moves a flake down by its speed times the seconds passed', () => {
		const flakes = [{ x: 0.5, y: 0.2, size: 10, speed: 0.4, alpha: 1, sprite: 0 }]

		advanceFlakes(flakes, 0.5)

		expect(flakes[0].y).toBeCloseTo(0.4)
		expect(flakes[0].x).toBe(0.5)
	})

	it('does not move anything when no time passed', () => {
		const flakes = [{ x: 0.5, y: 0.2, size: 10, speed: 0.4, alpha: 1, sprite: 0 }]

		advanceFlakes(flakes, 0)

		expect(flakes[0].y).toBe(0.2)
	})

	it('sends a flake that fell past the bottom back above the top', () => {
		const flakes = [{ x: 0.5, y: 1.1, size: 10, speed: 0.5, alpha: 1, sprite: 0 }]

		advanceFlakes(flakes, 0.1)

		expect(flakes[0].y).toBeLessThan(0)
	})
})
