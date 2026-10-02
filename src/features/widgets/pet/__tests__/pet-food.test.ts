import { describe, expect, it } from 'bun:test'
import type { CollectibleItem } from '../types'
import { findNearestFood, foodDropX, stepCollectibles } from '../utils/pet-food'

function food(id: number, x: number, overrides: Partial<CollectibleItem> = {}) {
	return { id, x, y: 0, collected: false, dropping: false, ...overrides }
}

describe('foodDropX', () => {
	it('centres the food on the click', () => {
		expect(foodDropX(100, 400, 20)).toBe(90)
	})

	it('keeps the food inside both edges of the container', () => {
		expect(foodDropX(5, 400, 20)).toBe(0)
		expect(foodDropX(399, 400, 20)).toBe(380)
	})

	it('pins the food to the left edge when the container is narrower than the food', () => {
		expect(foodDropX(50, 10, 20)).toBe(0)
	})
})

describe('findNearestFood', () => {
	const items = [food(1, 100), food(2, 200)]

	it('returns the piece closest to the pet', () => {
		expect(findNearestFood(items, 190, 20)?.id).toBe(2)
		expect(findNearestFood(items, 120, 20)?.id).toBe(1)
	})

	it('prefers the first piece when two are equally close', () => {
		expect(findNearestFood(items, 160, 20)?.id).toBe(1)
	})

	it('ignores food that is eaten, still falling, or too high to reach', () => {
		const unreachable = [
			food(1, 100, { collected: true }),
			food(2, 100, { dropping: true, y: -30 }),
			food(3, 100, { y: 6 }),
		]
		expect(findNearestFood(unreachable, 110, 20)).toBeNull()
	})

	it('returns nothing when there is no food', () => {
		expect(findNearestFood([], 100, 20)).toBeNull()
	})
})

describe('stepCollectibles', () => {
	const step = {
		fallStep: 4,
		petCenter: 100,
		collectRadius: 25,
		foodSize: 20,
		canEat: true,
	}

	it('lowers food that is still dropping', () => {
		const result = stepCollectibles([food(1, 300, { dropping: true, y: -10 })], step)
		expect(result.items[0]).toMatchObject({ y: -6, dropping: true })
		expect(result.changed).toBe(true)
		expect(result.collectedId).toBeNull()
	})

	it('lands food on the floor instead of passing through it', () => {
		const result = stepCollectibles([food(1, 300, { dropping: true, y: -2 })], step)
		expect(result.items[0]).toMatchObject({ y: 0, dropping: false })
	})

	it('eats food under the pet', () => {
		const result = stepCollectibles([food(1, 90)], step)
		expect(result.items[0].collected).toBe(true)
		expect(result.collectedId).toBe(1)
		expect(result.changed).toBe(true)
	})

	it('leaves food alone when the pet cannot reach the floor', () => {
		const result = stepCollectibles([food(1, 90)], { ...step, canEat: false })
		expect(result.items[0].collected).toBe(false)
		expect(result.collectedId).toBeNull()
		expect(result.changed).toBe(false)
	})

	it('eats one piece per step', () => {
		const result = stepCollectibles([food(1, 90), food(2, 95)], step)
		expect(result.collectedId).toBe(1)
		expect(result.items[1].collected).toBe(false)
	})

	it('reports no change when nothing moves and nothing is in reach', () => {
		const items = [food(1, 300), food(2, 200, { collected: true })]
		const result = stepCollectibles(items, step)
		expect(result.changed).toBe(false)
		expect(result.items).toEqual(items)
	})
})
