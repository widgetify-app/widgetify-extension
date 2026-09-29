import type { PetSequence, PetState } from '../types'

type Pace = 'still' | 'walk' | 'run' | 'chase'

interface StateInfo {
	pace: Pace
	facing: 1 | -1 | 0
}

interface HoldRange {
	min: number
	max: number
}

interface WallBounds {
	minX: number
	maxX: number
}

const STATE_INFO: Record<PetState, StateInfo> = {
	'sit-idle': { pace: 'still', facing: 0 },
	lie: { pace: 'still', facing: 0 },
	eat: { pace: 'still', facing: 0 },
	'walk-right': { pace: 'walk', facing: 1 },
	'walk-left': { pace: 'walk', facing: -1 },
	'run-right': { pace: 'run', facing: 1 },
	'run-left': { pace: 'run', facing: -1 },
	chase: { pace: 'chase', facing: 0 },
}

const HOLD_MS: Partial<Record<PetState, HoldRange>> = {
	'sit-idle': { min: 3000, max: 6000 },
	lie: { min: 5000, max: 9000 },
	eat: { min: 1200, max: 1800 },
}

const RESTING: ReadonlySet<PetState> = new Set(['sit-idle', 'lie'])
const WALL_TOLERANCE = 0.5

export const START_STATE: PetState = 'sit-idle'
export const MAX_MOVE_MS = 30_000

export function paceOf(state: PetState): Pace {
	return STATE_INFO[state].pace
}

export function facingOf(state: PetState): 1 | -1 | 0 {
	return STATE_INFO[state].facing
}

export function holdMsFor(state: PetState, random: () => number): number {
	const range = HOLD_MS[state]
	if (!range) return MAX_MOVE_MS
	return range.min + (range.max - range.min) * random()
}

export function chooseNextState(
	sequence: PetSequence,
	from: PetState,
	hungry: boolean,
	random: () => number
): PetState {
	const options = sequence.next[from] ?? [START_STATE]
	const resting = options.filter((option) => RESTING.has(option))
	const pool = hungry && resting.length > 0 ? resting : options
	return pool[Math.floor(random() * pool.length)]
}

export function hasReachedWall(state: PetState, x: number, bounds: WallBounds): boolean {
	const facing = facingOf(state)
	if (facing === 1) return x >= bounds.maxX - WALL_TOLERANCE
	if (facing === -1) return x <= bounds.minX + WALL_TOLERANCE
	return false
}
