import autumnBackground from '@/assets/animals/backgrounds/autumn.png'
import beachBackground from '@/assets/animals/backgrounds/beach.png'
import forestBackground from '@/assets/animals/backgrounds/forest.png'
import catIcon from '@/assets/animals/cat/zardaloo_lie_8fps.webp'
import catPreview from '@/assets/animals/cat/zardaloo_swipe_8fps.webp'
import chickenIcon from '@/assets/animals/chicken/white_idle_8fps.webp'
import chickenPreview from '@/assets/animals/chicken/white_swipe_8fps.webp'
import crabIcon from '@/assets/animals/crab/red_idle_8fps.webp'
import crabPreview from '@/assets/animals/crab/red_swipe_8fps.webp'
import dogIcon from '@/assets/animals/dog/akita_lie_8fps.webp'
import dogPreview from '@/assets/animals/dog/akita_idle_8fps.webp'
import frogIcon from '@/assets/animals/frog/ghoori_lie_8fps.webp'
import frogPreview from '@/assets/animals/frog/ghoori_swipe_8fps.webp'
import {
	type PetBackground,
	type PetBackgroundId,
	type PetSettings,
	PetTypes,
} from './types'

export const PET_ICON: Record<PetTypes, string> = {
	[PetTypes.DOG]: dogIcon,
	[PetTypes.CHICKEN]: chickenIcon,
	[PetTypes.CRAB]: crabIcon,
	[PetTypes.FROG]: frogIcon,
	[PetTypes.CAT]: catIcon,
}

export const PET_PREVIEW: Record<PetTypes, string> = {
	[PetTypes.DOG]: dogPreview,
	[PetTypes.CHICKEN]: chickenPreview,
	[PetTypes.CRAB]: crabPreview,
	[PetTypes.FROG]: frogPreview,
	[PetTypes.CAT]: catPreview,
}

export const PET_SPECIES_LABEL: Record<PetTypes, string> = {
	[PetTypes.DOG]: 'سگ',
	[PetTypes.CHICKEN]: 'مرغ',
	[PetTypes.CRAB]: 'خرچنگ',
	[PetTypes.FROG]: 'قورباغه',
	[PetTypes.CAT]: 'گربه',
}

export const DEFAULT_PET_BACKGROUND: PetBackgroundId = 'forest'

export const PET_BACKGROUNDS: Record<PetBackgroundId, PetBackground> = {
	forest: {
		id: 'forest',
		label: 'جنگل شب',
		image: forestBackground,
		groundOffsetPx: 7,
	},
	autumn: {
		id: 'autumn',
		label: 'پاییز',
		image: autumnBackground,
		groundOffsetPx: 3,
	},
	beach: {
		id: 'beach',
		label: 'ساحل',
		image: beachBackground,
		groundOffsetPx: 10,
	},
}

export const PET_BACKGROUND_LIST = Object.values(PET_BACKGROUNDS)

export const HUNGER_GAIN_STEPS = [5, 10, 20]

export const MAX_ACTIVE_PET_FOOD = 3

export const BASE_PET_OPTIONS: PetSettings = {
	petType: PetTypes.DOG,
	background: DEFAULT_PET_BACKGROUND,
	petOptions: {
		[PetTypes.DOG]: {
			name: 'آکیتا',
			type: 'dog',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CHICKEN]: {
			name: 'قدقدپور',
			type: 'chicken',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CRAB]: {
			name: 'چنگولی',
			type: 'crab',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CAT]: {
			name: 'زردآلو',
			type: 'cat',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.FROG]: {
			name: 'قوری',
			type: 'frog',
			hungryState: { level: 100, lastHungerTick: null },
		},
	},
}
