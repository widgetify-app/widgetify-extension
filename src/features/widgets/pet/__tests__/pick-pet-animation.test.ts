import { describe, expect, it } from 'bun:test'
import type { PetAnimations, PetDimensions, PetHop, PetState } from '../types'
import { pickPetAnimation } from '../utils/pick-pet-animation'

const animations: PetAnimations = {
	idle: 'idle',
	walk: 'walk',
	run: 'run',
	swipe: 'swipe',
	sit: 'sit',
	fly: 'fly',
}

const plain: PetDimensions = {
	size: 32,
	width: 32,
	walkSpeed: 1,
	runSpeed: 2,
	maxHeight: 60,
}

const hop: PetHop = {
	distance: { min: 30, max: 50 },
	height: { min: 10, max: 20 },
	durationMs: 400,
	crouchMs: { min: 500, max: 1000 },
}

function pick(overrides: {
	petState?: PetState
	airborne?: boolean
	hopPhase?: 'crouch' | 'air'
	animations?: PetAnimations
	dimensions?: PetDimensions
}) {
	return pickPetAnimation({
		petState: 'sit-idle',
		hopPhase: 'crouch',
		airborne: false,
		animations,
		dimensions: plain,
		...overrides,
	})
}

describe('pickPetAnimation', () => {
	it('maps each state to its clip', () => {
		expect(pick({ petState: 'sit-idle' })).toBe('idle')
		expect(pick({ petState: 'walk-left' })).toBe('walk')
		expect(pick({ petState: 'walk-right' })).toBe('walk')
		expect(pick({ petState: 'run-left' })).toBe('run')
		expect(pick({ petState: 'run-right' })).toBe('run')
		expect(pick({ petState: 'chase' })).toBe('run')
		expect(pick({ petState: 'lie' })).toBe('sit')
		expect(pick({ petState: 'eat' })).toBe('swipe')
	})

	it('falls back to idle when a species has no lying or eating clip', () => {
		const bare: PetAnimations = { idle: 'idle', walk: 'walk', run: 'run' }
		expect(pick({ petState: 'lie', animations: bare })).toBe('idle')
		expect(pick({ petState: 'eat', animations: bare })).toBe('idle')
	})

	it('flies only when the species can fly and is off the ground', () => {
		const flier: PetDimensions = {
			...plain,
			flight: {
				cruiseMin: 10,
				cruiseMax: 30,
				bobAmplitude: 2,
				bobPeriodMs: 1000,
				climbRate: 1,
				landRate: 1,
				diveRate: 1,
				diveSlope: 1,
			},
		}
		expect(pick({ dimensions: flier, airborne: true })).toBe('fly')
		expect(pick({ dimensions: flier, airborne: false })).toBe('idle')
		expect(pick({ dimensions: plain, airborne: true })).toBe('idle')
		const grounded: PetAnimations = { idle: 'idle', walk: 'walk', run: 'run' }
		expect(
			pick({
				dimensions: flier,
				airborne: true,
				animations: grounded,
				petState: 'walk-left',
			})
		).toBe('walk')
	})

	it('shows the hop clip only while a hopping pet is in the air', () => {
		const hopper: PetDimensions = { ...plain, hop }
		expect(
			pick({ dimensions: hopper, petState: 'walk-right', hopPhase: 'air' })
		).toBe('run')
		expect(
			pick({ dimensions: hopper, petState: 'walk-right', hopPhase: 'crouch' })
		).toBe('idle')
		expect(pick({ dimensions: hopper, petState: 'lie', hopPhase: 'air' })).toBe('sit')
	})
})
