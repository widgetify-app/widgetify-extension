import { describe, expect, it } from 'bun:test'
import {
	clampToBounds,
	directionTowardWall,
	frameScale,
	getMovementBounds,
	isNearWall,
	pickClimbWall,
	stepWalk,
} from '../core/pet-movement'

const SPRITE_WIDTH = 50
const SPRITE_HEIGHT = 32

function bounds(containerWidth = 200, containerHeight = 64, maxHeight = 100) {
	return getMovementBounds(
		containerWidth,
		containerHeight,
		SPRITE_WIDTH,
		SPRITE_HEIGHT,
		maxHeight
	)
}

describe('getMovementBounds', () => {
	it('subtracts the sprite width from the horizontal bound, not its height', () => {
		const b = bounds(200)
		expect(b.maxX).toBe(140)
		expect(b.minX).toBe(10)
	})

	it('keeps the pet fully inside the container horizontally', () => {
		const b = bounds(200)
		expect(b.maxX + SPRITE_WIDTH).toBeLessThanOrEqual(200)
	})

	it('caps the climb height by the container height', () => {
		expect(bounds(200, 64, 100).maxY).toBe(32)
		expect(bounds(200, 64, 20).maxY).toBe(20)
	})

	it('never returns negative bounds for a collapsed container', () => {
		const b = bounds(0, 0)
		expect(b.maxX).toBeGreaterThanOrEqual(b.minX)
		expect(b.maxY).toBe(0)
	})

	it('never returns negative bounds for a container smaller than the sprite', () => {
		const b = bounds(30, 10)
		expect(b.maxX).toBeGreaterThanOrEqual(b.minX)
		expect(b.maxY).toBe(0)
	})
})

describe('pickClimbWall', () => {
	it('picks the right wall when the pet just bounced off it', () => {
		const b = bounds()
		expect(pickClimbWall(b.maxX, b)).toBe(b.maxX)
	})

	it('picks the left wall when the pet just bounced off it', () => {
		const b = bounds()
		expect(pickClimbWall(b.minX, b)).toBe(b.minX)
	})

	it('does not teleport a pet that bounced off the right wall', () => {
		const b = bounds()
		const afterBounce = stepWalk({ x: b.maxX - 1, y: 0 }, 1, 3.5, 1.5, b)

		expect(afterBounce.position.x).toBe(b.maxX)
		expect(afterBounce.direction).toBe(-1)
		expect(pickClimbWall(afterBounce.position.x, b)).toBe(b.maxX)
	})

	it('does not teleport a pet that bounced off the left wall', () => {
		const b = bounds()
		const afterBounce = stepWalk({ x: b.minX + 1, y: 0 }, -1, 3.5, 1.5, b)

		expect(afterBounce.position.x).toBe(b.minX)
		expect(afterBounce.direction).toBe(1)
		expect(pickClimbWall(afterBounce.position.x, b)).toBe(b.minX)
	})

	it('always resolves to the nearer wall across the whole track', () => {
		const b = bounds()
		const middle = (b.minX + b.maxX) / 2

		for (let x = b.minX; x <= b.maxX; x++) {
			const wall = pickClimbWall(x, b)
			expect(wall === b.minX || wall === b.maxX).toBe(true)
			if (x < middle) expect(wall).toBe(b.minX)
			if (x > middle) expect(wall).toBe(b.maxX)
		}
	})
})

describe('directionTowardWall', () => {
	it('faces the pet at the wall it climbs', () => {
		const b = bounds()
		expect(directionTowardWall(b.maxX, b)).toBe(1)
		expect(directionTowardWall(b.minX, b)).toBe(-1)
	})
})

describe('stepWalk', () => {
	it('turns around at the right wall without overshooting', () => {
		const b = bounds()
		const result = stepWalk({ x: b.maxX - 1, y: 0 }, 1, 3.5, 1.5, b)
		expect(result.position.x).toBe(b.maxX)
		expect(result.direction).toBe(-1)
	})

	it('turns around at the left wall without overshooting', () => {
		const b = bounds()
		const result = stepWalk({ x: b.minX + 1, y: 0 }, -1, 3.5, 1.5, b)
		expect(result.position.x).toBe(b.minX)
		expect(result.direction).toBe(1)
	})

	it('keeps the pet inside the track over a long walk', () => {
		const b = bounds()
		let position = { x: b.minX, y: 0 }
		let direction = 1

		for (let i = 0; i < 500; i++) {
			const result = stepWalk(position, direction, 3.5, 1.5, b)
			position = result.position
			direction = result.direction
			expect(position.x).toBeGreaterThanOrEqual(b.minX)
			expect(position.x).toBeLessThanOrEqual(b.maxX)
		}
	})

	it('pulls the pet back down to the floor while walking', () => {
		const b = bounds()
		const result = stepWalk({ x: 50, y: 10 }, 1, 1, 1.5, b)
		expect(result.position.y).toBe(8.5)
	})

	it('never pushes the pet below the floor', () => {
		const b = bounds()
		const result = stepWalk({ x: 50, y: 0.5 }, 1, 1, 1.5, b)
		expect(result.position.y).toBe(0)
	})
})

describe('clampToBounds', () => {
	it('brings out of range positions back inside', () => {
		const b = bounds()
		expect(clampToBounds({ x: -100, y: -100 }, b)).toEqual({ x: b.minX, y: 0 })
		expect(clampToBounds({ x: 9999, y: 9999 }, b)).toEqual({
			x: b.maxX,
			y: b.maxY,
		})
	})
})

describe('isNearWall', () => {
	it('detects both walls', () => {
		const b = bounds()
		expect(isNearWall(b.minX, b)).toBe(true)
		expect(isNearWall(b.maxX, b)).toBe(true)
		expect(isNearWall((b.minX + b.maxX) / 2, b)).toBe(false)
	})
})

describe('frameScale', () => {
	it('is 1 at the reference frame time', () => {
		expect(frameScale(16.67)).toBeCloseTo(1, 5)
	})

	it('keeps travel per second stable across refresh rates', () => {
		const at60 = frameScale(16.67) * 60
		const at144 = frameScale(6.94) * 144
		expect(Math.abs(at60 - at144)).toBeLessThan(1)
	})

	it('guards against bad or huge deltas', () => {
		expect(frameScale(0)).toBe(1)
		expect(frameScale(Number.NaN)).toBe(1)
		expect(frameScale(10000)).toBe(3)
	})
})
