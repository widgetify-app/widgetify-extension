import type React from 'react'
import { Suspense } from 'react'
import { PetHud } from './components/pet-hud'
import { PetTypes, usePetContext } from './pet.context'
import { CatComponent } from './pet-item/pet-cat'
import { ChickenComponent } from './pet-item/pet-chicken'
import { CrabComponent } from './pet-item/pet-crab'
import { DogComponent } from './pet-item/pet-dog'
import { FrogComponent } from './pet-item/pet-frog'

export const PetFactory: React.FC = () => {
	const { petType, getPetHungryState } = usePetContext()
	if (!petType) return null

	let PetComponent = null

	switch (petType) {
		case PetTypes.DOG_AKITA:
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
			<PetComponent />

			<div className="absolute bottom-0 justify-center hidden left-2 md:flex">
				<PetHud level={getPetHungryState(petType)?.level ?? 0} />
			</div>
		</Suspense>
	)
}
