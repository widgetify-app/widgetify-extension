import { describe, expect, it } from 'bun:test'
import { chooseTickMode, IDLE_POLL_MS } from '../utils/pet-schedule'

const resting = { visible: true, still: true, grounded: true, hasFood: false }

describe('chooseTickMode', () => {
	it('stops completely while the widget is not on screen', () => {
		expect(chooseTickMode({ ...resting, visible: false })).toBe('stopped')
		expect(
			chooseTickMode({
				visible: false,
				still: false,
				grounded: false,
				hasFood: true,
			})
		).toBe('stopped')
	})

	it('polls slowly while the pet rests on the ground with nothing to do', () => {
		expect(chooseTickMode(resting)).toBe('idle')
	})

	it('runs every frame while the pet is moving', () => {
		expect(chooseTickMode({ ...resting, still: false })).toBe('frame')
	})

	it('runs every frame while the pet is still above the ground', () => {
		expect(chooseTickMode({ ...resting, grounded: false })).toBe('frame')
	})

	it('runs every frame while there is food to fall or to eat', () => {
		expect(chooseTickMode({ ...resting, hasFood: true })).toBe('frame')
	})

	it('needs every fact to be resting before it sleeps', () => {
		for (const key of ['still', 'grounded'] as const) {
			expect(chooseTickMode({ ...resting, [key]: false })).toBe('frame')
		}
		expect(chooseTickMode({ ...resting, hasFood: true })).toBe('frame')
	})

	it('polls often enough that a short rest still ends on time', () => {
		expect(IDLE_POLL_MS).toBeLessThanOrEqual(100)
		expect(IDLE_POLL_MS).toBeGreaterThan(16)
	})
})
