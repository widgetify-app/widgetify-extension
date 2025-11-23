import { usePetContext } from './pet.context'
import { PetFactory } from './pet-factory'

export function Pet() {
	const { isEnabled } = usePetContext()

	if (!isEnabled) return null

	return <PetFactory />
}
