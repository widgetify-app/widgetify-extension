import { describe, expect, it } from 'bun:test'
import { type PetSequence, type PetState, PetTypes } from '../types'
import {
	chooseNextState,
	facingOf,
	hasReachedWall,
	holdMsFor,
	MAX_MOVE_MS,
	paceOf,
	START_STATE,
} from '../utils/pet-sequence'
import { PET_SEQUENCES } from '../utils/species-sequences'

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

const ALL_STATES: PetState[] = [
	'sit-idle',
	'lie',
	'walk-right',
	'walk-left',
	'run-right',
	'run-left',
	'chase',
	'eat',
]

const bounds = { minX: 10, maxX: 300 }

describe('state facts', () => {
	it('gives every state a pace', () => {
		expect(paceOf('sit-idle')).toBe('still')
		expect(paceOf('lie')).toBe('still')
		expect(paceOf('eat')).toBe('still')
		expect(paceOf('walk-left')).toBe('walk')
		expect(paceOf('run-right')).toBe('run')
		expect(paceOf('chase')).toBe('chase')
	})

	it('faces the way a moving state travels and keeps the facing when still', () => {
		expect(facingOf('walk-right')).toBe(1)
		expect(facingOf('run-right')).toBe(1)
		expect(facingOf('walk-left')).toBe(-1)
		expect(facingOf('run-left')).toBe(-1)
		expect(facingOf('sit-idle')).toBe(0)
		expect(facingOf('chase')).toBe(0)
	})
})

describe('holdMsFor', () => {
	it('holds resting states for several seconds inside their range', () => {
		expect(holdMsFor('sit-idle', constant(0))).toBe(3000)
		expect(holdMsFor('sit-idle', constant(1))).toBe(6000)
		expect(holdMsFor('lie', constant(0))).toBe(5000)
		expect(holdMsFor('eat', constant(0.5))).toBeCloseTo(1500, 5)
	})

	it('gives moving states a long safety limit instead of a short timer', () => {
		expect(holdMsFor('walk-right', constant(0.5))).toBe(MAX_MOVE_MS)
		expect(holdMsFor('run-left', constant(0.5))).toBe(MAX_MOVE_MS)
	})
})

describe('hasReachedWall', () => {
	it('completes a rightward walk only at the right wall', () => {
		expect(hasReachedWall('walk-right', 100, bounds)).toBe(false)
		expect(hasReachedWall('walk-right', 300, bounds)).toBe(true)
		expect(hasReachedWall('run-right', 299.8, bounds)).toBe(true)
	})

	it('completes a leftward walk only at the left wall', () => {
		expect(hasReachedWall('walk-left', 100, bounds)).toBe(false)
		expect(hasReachedWall('walk-left', 10, bounds)).toBe(true)
		expect(hasReachedWall('run-left', 10.3, bounds)).toBe(true)
	})

	it('never completes a state that does not travel', () => {
		expect(hasReachedWall('sit-idle', 300, bounds)).toBe(false)
		expect(hasReachedWall('chase', 10, bounds)).toBe(false)
	})
})

describe('chooseNextState', () => {
	const sequence: PetSequence = {
		next: {
			'sit-idle': ['walk-right', 'run-right', 'lie'],
			'walk-right': ['walk-left', 'run-left'],
		},
	}

	it('picks only from the listed next states', () => {
		const random = seeded(4)
		for (let i = 0; i < 300; i++) {
			expect(['walk-right', 'run-right', 'lie']).toContain(
				chooseNextState(sequence, 'sit-idle', false, random)
			)
		}
	})

	it('reaches every listed option over many draws', () => {
		const random = seeded(8)
		const seen = new Set<PetState>()
		for (let i = 0; i < 300; i++) {
			seen.add(chooseNextState(sequence, 'sit-idle', false, random))
		}
		expect(seen.size).toBe(3)
	})

	it('falls back to sitting when a state has no entry', () => {
		expect(chooseNextState(sequence, 'run-left', false, constant(0.5))).toBe(
			START_STATE
		)
	})

	it('keeps a hungry pet resting when it has a resting option', () => {
		const random = seeded(2)
		for (let i = 0; i < 100; i++) {
			expect(['sit-idle', 'lie']).toContain(
				chooseNextState(
					{ next: { eat: ['walk-right', 'lie', 'run-left'] } },
					'eat',
					true,
					random
				)
			)
		}
	})

	it('lets a hungry pet keep moving when the tree offers no rest', () => {
		expect(chooseNextState(sequence, 'walk-right', true, constant(0))).toBe(
			'walk-left'
		)
	})
})

describe('species sequences', () => {
	const species = Object.entries(PET_SEQUENCES) as [PetTypes, PetSequence][]

	it('defines a tree for every pet', () => {
		expect(species.map(([type]) => type).sort()).toEqual(
			Object.values(PetTypes).sort()
		)
	})

	for (const [type, sequence] of species) {
		describe(type, () => {
			it('only mentions real states', () => {
				for (const [from, options] of Object.entries(sequence.next)) {
					expect(ALL_STATES).toContain(from as PetState)
					for (const option of options ?? [])
						expect(ALL_STATES).toContain(option)
				}
			})

			it('never leaves a state without a next step', () => {
				const seen = new Set<PetState>()
				const queue: PetState[] = [START_STATE, 'chase']
				while (queue.length > 0) {
					const state = queue.pop() as PetState
					if (seen.has(state)) continue
					seen.add(state)
					const options = sequence.next[state]
					expect(options?.length ?? 0).toBeGreaterThan(0)
					queue.push(...(options ?? []))
				}
			})

			it('turns around after each wall instead of walking on', () => {
				for (const from of ['walk-right', 'run-right'] as const) {
					for (const option of sequence.next[from] ?? []) {
						expect(facingOf(option)).toBe(-1)
					}
				}
			})

			it('eventually sits again after a leftward trip', () => {
				const left = [
					...(sequence.next['walk-left'] ?? []),
					...(sequence.next['run-left'] ?? []),
				]
				expect(left).toContain('sit-idle')
			})

			it('goes from eating back to moving', () => {
				for (const option of sequence.next.eat ?? []) {
					expect(paceOf(option)).not.toBe('still')
				}
			})

			it('sends a finished chase to eating', () => {
				expect(sequence.next.chase).toEqual(['eat'])
			})

			it('has a varied random day that never gets stuck', () => {
				const random = seeded(31)
				const visited = new Set<PetState>()
				let state: PetState = START_STATE
				for (let i = 0; i < 2000; i++) {
					state = chooseNextState(sequence, state, false, random)
					visited.add(state)
				}
				expect(visited.size).toBeGreaterThanOrEqual(5)
			})
		})
	}

	it('does not give pets without a resting animation a lie state', () => {
		const uses = (type: PetTypes) =>
			Object.values(PET_SEQUENCES[type].next).some((options) =>
				options?.includes('lie')
			)
		expect(uses(PetTypes.CHICKEN)).toBe(false)
		expect(uses(PetTypes.CRAB)).toBe(false)
		expect(uses(PetTypes.DOG)).toBe(true)
	})
})
