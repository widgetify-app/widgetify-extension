import { ChickenComponent } from './pet-item/pet-chicken'
import { DogComponent } from './pet-item/pet-dog'
import { PetTypes, usePetContext } from './pet.context'

export function Pet() {
	const { enablePets, petType } = usePetContext()

	if (!enablePets) return null

	if (petType === PetTypes.CHICKEN) {
		return <ChickenComponent />
	}
	if (petType === PetTypes.DOG_AKITA) {
		return <DogComponent />
	}

	return null
}
