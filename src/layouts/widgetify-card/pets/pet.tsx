import { DogComponent } from './pet-item/pet-dog.component'
import { usePetContext } from './pet.context'

export function Pet() {
	const { enablePets } = usePetContext()

	if (!enablePets) return null

	return <DogComponent />
}
