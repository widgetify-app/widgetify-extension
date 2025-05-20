import { PetFactory } from './pet-factory'
import { usePetContext } from './pet.context'

export function Pet() {
	const { enablePets, petType } = usePetContext()

	if (!enablePets) return null

	return <PetFactory petType={petType} />
}
