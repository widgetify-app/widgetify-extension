import { describe, expect, it } from 'bun:test'
import type { PetHop } from '../types'
import { createHopState, type HopState, stepHop } from '../utils/pet-hop'
import { getMovementBounds } from '../utils/pet-movement'

const bounds = getMovementBounds(400, 64, 50, 32, 80)
const FRAME_MS = 16.67

const hop: PetHop = {
	distance: { min: 35, max: 60 },
	height: { min: 12, max: 22 },
	durationMs: 450,
	crouchMs: { min: 500, max: 1200 },
}

function seeded(seed: number) {
	let state = seed
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296
		return state / 4294967296
	}
}

function constant(value: number) {
	return () => value
}

function run(options: {
	frames: number
	seed: number
	direction: number
	fast?: boolean
	targetX?: number | null
	startX?: number
}) {
	const random = seeded(options.seed)
	const fast = options.fast ?? false
	let state: HopState = createHopState(hop, fast, random)
	let position = { x: options.startX ?? 100, y: 0 }
	let direction = options.direction
	let hops = 0
	let peak = 0
	let airborne = false

	for (let i = 0; i < options.frames; i++) {
		const result = stepHop({
			state,
			position,
			direction,
			hop,
			fast,
			elapsedMs: FRAME_MS,
			bounds,
			targetX: options.targetX ?? null,
			random,
		})
		state = result.state
		position = result.position
		direction = result.direction
		peak = Math.max(peak, position.y)

		if (state.phase === 'air') airborne = true
		if (airborne && state.phase === 'crouch') {
			hops++
			airborne = false
			expect(position.y).toBe(0)
		}

		expect(position.x).toBeGreaterThanOrEqual(bounds.minX)
		expect(position.x).toBeLessThanOrEqual(bounds.maxX)
		expect(position.y).toBeGreaterThanOrEqual(0)
	}
	return { state, position, direction, hops, peak }
}

describe('createHopState', () => {
	it('starts crouching for a time inside the crouch range', () => {
		const state = createHopState(hop, false, constant(0.5))
		expect(state.phase).toBe('crouch')
		expect(state.timerMs).toBeCloseTo(850, 5)
	})

	it('crouches for a much shorter time when moving fast', () => {
		expect(createHopState(hop, true, constant(0.5)).timerMs).toBeLessThan(
			createHopState(hop, false, constant(0.5)).timerMs
		)
	})
})

describe('crouching', () => {
	it('stays still while the crouch timer runs', () => {
		const state = createHopState(hop, false, constant(0.5))
		const result = stepHop({
			state,
			position: { x: 100, y: 0 },
			direction: 1,
			hop,
			fast: false,
			elapsedMs: FRAME_MS,
			bounds,
			targetX: null,
			random: constant(0.5),
		})
		expect(result.state.phase).toBe('crouch')
		expect(result.position).toEqual({ x: 100, y: 0 })
	})

	it('launches once the crouch is over', () => {
		const state: HopState = {
			...createHopState(hop, false, constant(0.5)),
			timerMs: 5,
		}
		const result = stepHop({
			state,
			position: { x: 100, y: 0 },
			direction: 1,
			hop,
			fast: false,
			elapsedMs: FRAME_MS,
			bounds,
			targetX: null,
			random: constant(0.5),
		})
		expect(result.state.phase).toBe('air')
		expect(result.state.dx).toBeCloseTo(47.5, 5)
	})
})

describe('hopping', () => {
	it('lands exactly on the floor after every hop', () => {
		const { hops } = run({ frames: 6000, seed: 3, direction: 1 })
		expect(hops).toBeGreaterThanOrEqual(4)
	})

	it('travels in the requested direction', () => {
		const right = run({ frames: 1200, seed: 5, direction: 1, startX: 60 })
		expect(right.position.x).toBeGreaterThan(60)
		const left = run({ frames: 1200, seed: 5, direction: -1, startX: 250 })
		expect(left.position.x).toBeLessThan(250)
	})

	it('never rises above the configured hop height', () => {
		const { peak } = run({ frames: 6000, seed: 7, direction: 1 })
		expect(peak).toBeGreaterThan(10)
		expect(peak).toBeLessThanOrEqual(22)
	})

	it('crosses the track sooner when running than when walking', () => {
		const framesToWall = (fast: boolean) => {
			const random = seeded(9)
			let state = createHopState(hop, fast, random)
			let position = { x: bounds.minX, y: 0 }
			for (let frame = 1; frame <= 20000; frame++) {
				const result = stepHop({
					state,
					position,
					direction: 1,
					hop,
					fast,
					elapsedMs: FRAME_MS,
					bounds,
					targetX: null,
					random,
				})
				state = result.state
				position = result.position
				if (position.x >= bounds.maxX) return frame
			}
			return Number.POSITIVE_INFINITY
		}
		expect(framesToWall(true)).toBeLessThan(framesToWall(false))
	})

	it('stops at a wall without leaving the track', () => {
		const result = run({ frames: 4000, seed: 11, direction: 1, startX: 200 })
		expect(result.position.x).toBe(bounds.maxX)
	})

	it('stays crouched at a wall instead of hopping into it', () => {
		const random = constant(0)
		const state: HopState = { ...createHopState(hop, false, random), timerMs: 0 }
		const result = stepHop({
			state,
			position: { x: bounds.maxX, y: 0 },
			direction: 1,
			hop,
			fast: false,
			elapsedMs: FRAME_MS,
			bounds,
			targetX: null,
			random,
		})
		expect(result.state.phase).toBe('crouch')
		expect(result.position.x).toBe(bounds.maxX)
	})
})

describe('chasing a target', () => {
	it('hops toward the target and lands on it without overshooting', () => {
		const target = 250
		const random = seeded(13)
		let state = createHopState(hop, true, random)
		let position = { x: 60, y: 0 }
		let direction = 1
		for (let i = 0; i < 4000; i++) {
			const result = stepHop({
				state,
				position,
				direction,
				hop,
				fast: true,
				elapsedMs: FRAME_MS,
				bounds,
				targetX: target,
				random,
			})
			state = result.state
			position = result.position
			direction = result.direction
			expect(position.x).toBeLessThanOrEqual(target + 0.001)
		}
		expect(position.x).toBeCloseTo(target, 0)
		expect(position.y).toBe(0)
	})

	it('turns to face a target behind it', () => {
		const result = run({
			frames: 1500,
			seed: 17,
			direction: 1,
			targetX: 40,
			startX: 200,
			fast: true,
		})
		expect(result.position.x).toBeLessThan(200)
		expect(result.direction).toBe(-1)
	})
})
