import { DEFAULT_PET_BACKGROUND, PET_BACKGROUNDS } from '../constants'
import type { PetBackground, PetBackgroundId } from '../types'

export function getPetBackground(id?: PetBackgroundId | null): PetBackground {
	return (id && PET_BACKGROUNDS[id]) || PET_BACKGROUNDS[DEFAULT_PET_BACKGROUND]
}
