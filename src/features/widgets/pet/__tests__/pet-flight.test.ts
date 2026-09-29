import { describe, expect, it } from 'bun:test'
import type { PetFlight } from '../types'
import {
	COLLECT_HEIGHT,
	flightBob,
	pickCruiseAltitude,
	stepDive,
	stepFlight,
	stepLanding,
} from '../utils/pet-flight'
import { getMovementBounds } from '../utils/pet-movement'

const profile: PetFlight = {
	cruiseMin: 12,
	cruiseMax: 28,
	bobAmplitude: 3,
	bobPeriodMs: 900,
	climbRate: 0.9,
	landRate: 0.7,
	diveRate: 1.4,
	diveSlope: 0.5,
}

const bounds = getMovementBounds(300, 64, 50, 32, 100)

describe('pickCruiseAltitude', () => {
	it('stays inside the configured cruise band', () => {
		expect(pickCruiseAltitude(profile, bounds, 0)).toBe(12)
		expect(pickCruiseAltitude(profile, bounds, 1)).toBe(28)
		expect(pickCruiseAltitude(profile, bounds, 0.5)).toBe(20)
	})

	it('never exceeds the room above the floor in a short container', () => {
		const short = getMovementBounds(300, 48, 50, 32, 100)
		expect(short.maxY).toBe(16)
		expect(pickCruiseAltitude(profile, short, 1)).toBe(16)
		expect(pickCruiseAltitude(profile, short, 0)).toBeLessThanOrEqual(16)
	})
})

describe('flightBob', () => {
	it('is zero at the start and swings by the amplitude', () => {
		expect(flightBob(profile, 0)).toBeCloseTo(0, 5)
		expect(flightBob(profile, 225)).toBeCloseTo(3, 5)
		expect(flightBob(profile, 675)).toBeCloseTo(-3, 5)
	})
})

describe('stepFlight', () => {
	it('climbs toward the cruise altitude by the climb step only', () => {
		const result = stepFlight({ x: 100, y: 0 }, 1, 1, 20, 0.9, bounds)
		expect(result.position.y).toBe(0.9)
		expect(result.position.x).toBe(101)
	})

	it('settles exactly on the altitude without overshooting', () => {
		const result = stepFlight({ x: 100, y: 19.8 }, 1, 1, 20, 0.9, bounds)
		expect(result.position.y).toBe(20)
	})

	it('descends toward a lower altitude', () => {
		const result = stepFlight({ x: 100, y: 25 }, 1, 1, 20, 0.9, bounds)
		expect(result.position.y).toBeCloseTo(24.1, 5)
	})

	it('never flies above the ceiling or below the floor', () => {
		expect(stepFlight({ x: 100, y: 30 }, 1, 1, 999, 50, bounds).position.y).toBe(
			bounds.maxY
		)
		expect(stepFlight({ x: 100, y: 5 }, 1, 1, -50, 50, bounds).position.y).toBe(0)
	})

	it('turns around at the walls like a walking pet', () => {
		const right = stepFlight({ x: bounds.maxX - 1, y: 10 }, 1, 3, 10, 1, bounds)
		expect(right.position.x).toBe(bounds.maxX)
		expect(right.direction).toBe(-1)
		const left = stepFlight({ x: bounds.minX + 1, y: 10 }, -1, 3, 10, 1, bounds)
		expect(left.position.x).toBe(bounds.minX)
		expect(left.direction).toBe(1)
	})

	it('stays inside the track over a long flight', () => {
		let position = { x: bounds.minX, y: 0 }
		let direction = 1
		for (let i = 0; i < 2000; i++) {
			const altitude = 20 + flightBob(profile, i * 16)
			const result = stepFlight(position, direction, 2.4, altitude, 0.9, bounds)
			position = result.position
			direction = result.direction
			expect(position.x).toBeGreaterThanOrEqual(bounds.minX)
			expect(position.x).toBeLessThanOrEqual(bounds.maxX)
			expect(position.y).toBeGreaterThanOrEqual(0)
			expect(position.y).toBeLessThanOrEqual(bounds.maxY)
		}
	})
})

describe('stepLanding', () => {
	it('sinks by the land step and never below the floor', () => {
		expect(stepLanding(10, 0.7)).toBeCloseTo(9.3, 5)
		expect(stepLanding(0.3, 0.7)).toBe(0)
	})
})

describe('stepDive', () => {
	it('holds altitude while the food is still far away', () => {
		expect(stepDive(20, 200, 1.4, 0.5)).toBe(20)
	})

	it('descends by at most the dive step once inside the glide slope', () => {
		expect(stepDive(20, 10, 1.4, 0.5)).toBeCloseTo(18.6, 5)
	})

	it('reaches eating height before arriving over the food', () => {
		let y = 28
		let distance = 120
		while (distance > 2) {
			y = stepDive(y, distance, 1.4, 0.5)
			distance -= 2.4
		}
		expect(y).toBeLessThanOrEqual(COLLECT_HEIGHT)
	})

	it('never goes below the floor', () => {
		expect(stepDive(0.5, 0, 1.4, 0.5)).toBe(0)
	})
})
