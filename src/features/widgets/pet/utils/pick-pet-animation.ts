import type { PetAnimations, PetDimensions, PetState } from '../types'
import type { HopPhase } from './pet-hop'
import { paceOf } from './pet-sequence'

interface AnimationFacts {
	petState: PetState
	hopPhase: HopPhase
	airborne: boolean
	animations: PetAnimations
	dimensions: PetDimensions
}

export function pickPetAnimation(facts: AnimationFacts): string {
	const { petState, hopPhase, airborne, animations, dimensions } = facts

	if (dimensions.flight && airborne && animations.fly) return animations.fly

	const hopping = dimensions.hop !== undefined && paceOf(petState) !== 'still'
	if (hopping) return hopPhase === 'air' ? animations.run : animations.idle

	switch (petState) {
		case 'lie':
			return animations.sit || animations.idle
		case 'eat':
			return animations.swipe || animations.idle
		case 'walk-right':
		case 'walk-left':
			return animations.walk
		case 'run-right':
		case 'run-left':
		case 'chase':
			return animations.run
		default:
			return animations.idle
	}
}
