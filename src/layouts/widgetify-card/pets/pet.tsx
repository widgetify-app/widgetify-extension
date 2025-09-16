import { usePetContext } from './pet.context'
import { PetFactory } from './pet-factory'

export function Pet() {
	const { enablePets } = usePetContext()

	if (!enablePets) return null

	return <PetFactory />
}
