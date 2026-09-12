import type React from 'react'
import { Suspense } from 'react'
import { PetHud } from './pet-hud'
import { usePetContext } from '../pet.context'
import { PetTypes } from '../types'
import { CatComponent } from './pet-item/pet-cat'
import { ChickenComponent } from './pet-item/pet-chicken'
import { CrabComponent } from './pet-item/pet-crab'
import { DogComponent } from './pet-item/pet-dog'
import { FrogComponent } from './pet-item/pet-frog'

interface Prop {
	className?: string
}
export const PetFactory: React.FC<Prop> = ({ className }) => {
	const { petType, getPetHungryState } = usePetContext()
	if (!petType) return null

	let PetComponent: React.ComponentType<{ className?: string }> | null = null

	switch (petType) {
		case PetTypes.DOG:
			PetComponent = DogComponent
			break
		case PetTypes.CHICKEN:
			PetComponent = ChickenComponent
			break
		case PetTypes.CRAB:
			PetComponent = CrabComponent
			break
		case PetTypes.FROG:
			PetComponent = FrogComponent
			break
		case PetTypes.CAT:
			PetComponent = CatComponent
			break
		default:
			return null
	}

	return (
		<Suspense fallback={<div></div>}>
			<PetComponent className={className} />

			<div className="absolute z-20 flex top-1.5 left-3">
				<PetHud level={getPetHungryState(petType)?.level ?? 0} />
			</div>
		</Suspense>
	)
}
