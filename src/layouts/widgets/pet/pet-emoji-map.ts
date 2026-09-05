import { PetTypes } from './pet.context'

export const PetEmojiMap: Record<PetTypes, string> = {
	[PetTypes.DOG_AKITA]: '🐶',
	[PetTypes.CHICKEN]: '🐔',
	[PetTypes.CRAB]: '🦀',
	[PetTypes.FROG]: '🐸',
	[PetTypes.CAT]: '🐱',
}
