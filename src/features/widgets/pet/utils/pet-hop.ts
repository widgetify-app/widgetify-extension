import type { PetHop, Position } from '../types'

interface HopBounds {
	minX: number
	maxX: number
}

export type HopPhase = 'crouch' | 'air'

export interface HopState {
	phase: HopPhase
	timerMs: number
	fromX: number
	dx: number
	height: number
	durationMs: number
	elapsedMs: number
}

interface HopStepInput {
	state: HopState
	position: Position
	direction: number
	hop: PetHop
	fast: boolean
	elapsedMs: number
	bounds: HopBounds
	targetX: number | null
	random: () => number
}

interface HopStepResult {
	state: HopState
	position: Position
	direction: number
}

const FAST_CROUCH_FACTOR = 0.4
const FAST_DISTANCE_FACTOR = 1.5
const FAST_HEIGHT_FACTOR = 1.2
const FAST_DURATION_FACTOR = 0.75
const MIN_HOP_DISTANCE = 0.5

function between(range: { min: number; max: number }, random: () => number): number {
	return range.min + (range.max - range.min) * random()
}

function clampX(x: number, bounds: HopBounds): number {
	return Math.max(bounds.minX, Math.min(bounds.maxX, x))
}

function crouchFor(hop: PetHop, fast: boolean, random: () => number): HopState {
	const factor = fast ? FAST_CROUCH_FACTOR : 1
	return {
		phase: 'crouch',
		timerMs: between(hop.crouchMs, random) * factor,
		fromX: 0,
		dx: 0,
		height: 0,
		durationMs: hop.durationMs,
		elapsedMs: 0,
	}
}

export function createHopState(
	hop: PetHop,
	fast: boolean,
	random: () => number
): HopState {
	return crouchFor(hop, fast, random)
}

export function stepHop(input: HopStepInput): HopStepResult {
	const { state, position, hop, fast, elapsedMs, bounds, targetX, random } = input
	let direction = input.direction

	if (state.phase === 'air') {
		const elapsed = state.elapsedMs + elapsedMs
		const progress = Math.min(1, elapsed / state.durationMs)
		const x = clampX(state.fromX + state.dx * progress, bounds)
		direction = Math.sign(state.dx) || direction

		if (progress >= 1) {
			return {
				state: crouchFor(hop, fast, random),
				position: { x, y: 0 },
				direction,
			}
		}
		return {
			state: { ...state, elapsedMs: elapsed },
			position: { x, y: 4 * state.height * progress * (1 - progress) },
			direction,
		}
	}

	const timerMs = state.timerMs - elapsedMs
	if (timerMs > 0) {
		return { state: { ...state, timerMs }, position, direction }
	}

	if (targetX !== null) direction = Math.sign(targetX - position.x) || direction

	let distance = between(hop.distance, random) * (fast ? FAST_DISTANCE_FACTOR : 1)
	if (targetX !== null) distance = Math.min(distance, Math.abs(targetX - position.x))

	const dx = clampX(position.x + direction * distance, bounds) - position.x
	if (Math.abs(dx) < MIN_HOP_DISTANCE) {
		return { state: crouchFor(hop, fast, random), position, direction }
	}

	return {
		state: {
			phase: 'air',
			timerMs: 0,
			fromX: position.x,
			dx,
			height: between(hop.height, random) * (fast ? FAST_HEIGHT_FACTOR : 1),
			durationMs: hop.durationMs * (fast ? FAST_DURATION_FACTOR : 1),
			elapsedMs: 0,
		},
		position,
		direction,
	}
}
