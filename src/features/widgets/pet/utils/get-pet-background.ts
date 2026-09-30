import { DEFAULT_PET_BACKGROUND, PET_BACKGROUNDS } from '../constants'
import type { PetBackground, PetBackgroundId } from '../types'

export function getPetBackground(
	id?: PetBackgroundId | null,
	backgroundMeta?: { image?: string | null; groundOffsetPx?: number } | null
): PetBackground {
	if (id && PET_BACKGROUNDS[id as keyof typeof PET_BACKGROUNDS]) {
		return PET_BACKGROUNDS[id as keyof typeof PET_BACKGROUNDS]
	}

	if (id && backgroundMeta?.image) {
		return {
			id,
			label: id,
			image: backgroundMeta.image,
			groundOffsetPx:
				typeof backgroundMeta.groundOffsetPx === 'number'
					? backgroundMeta.groundOffsetPx
					: 0,
		}
	}

	return PET_BACKGROUNDS[DEFAULT_PET_BACKGROUND]
}
