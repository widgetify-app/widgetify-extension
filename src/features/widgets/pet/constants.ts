import autumnBackground from '@/assets/animals/backgrounds/autumn.webp'
import beachBackground from '@/assets/animals/backgrounds/beach.webp'
import forestBackground from '@/assets/animals/backgrounds/forest.webp'
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
import owlIcon from '@/assets/animals/owl/owl_idle_8fps.webp'
import owlPreview from '@/assets/animals/owl/owl_swipe_8fps.webp'
import hedgehogIcon from '@/assets/animals/hedgehog/hedgehog_idle_8fps.webp'
import hedgehogPreview from '@/assets/animals/hedgehog/hedgehog_swipe_8fps.webp'
import sheepIcon from '@/assets/animals/sheep/sheep_idle_8fps.webp'
import sheepPreview from '@/assets/animals/sheep/sheep_swipe_8fps.webp'
import { t } from '@/common/i18n'
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
	[PetTypes.OWL]: owlIcon,
	[PetTypes.SHEEP]: sheepIcon,
	[PetTypes.HEDGEHOG]: hedgehogIcon,
}

export const PET_PREVIEW: Record<PetTypes, string> = {
	[PetTypes.DOG]: dogPreview,
	[PetTypes.CHICKEN]: chickenPreview,
	[PetTypes.CRAB]: crabPreview,
	[PetTypes.FROG]: frogPreview,
	[PetTypes.CAT]: catPreview,
	[PetTypes.OWL]: owlPreview,
	[PetTypes.SHEEP]: sheepPreview,
	[PetTypes.HEDGEHOG]: hedgehogPreview,
}

export const PET_SPECIES_LABEL: Record<PetTypes, string> = {
	[PetTypes.DOG]: t('widgets.pet.species.dog'),
	[PetTypes.CHICKEN]: t('widgets.pet.species.chicken'),
	[PetTypes.CRAB]: t('widgets.pet.species.crab'),
	[PetTypes.FROG]: t('widgets.pet.species.frog'),
	[PetTypes.CAT]: t('widgets.pet.species.cat'),
	[PetTypes.OWL]: t('widgets.pet.species.owl'),
	[PetTypes.SHEEP]: t('widgets.pet.species.sheep'),
	[PetTypes.HEDGEHOG]: t('widgets.pet.species.hedgehog'),
}

export const DEFAULT_PET_BACKGROUND: PetBackgroundId = 'none'

export const PET_BACKGROUNDS: Record<PetBackgroundId, PetBackground> = {
	none: {
		id: 'none',
		label: t('widgets.pet.background.none'),
		image: null,
		groundOffsetPx: 0,
	},
	forest: {
		id: 'forest',
		label: t('widgets.pet.background.forest'),
		image: forestBackground,
		groundOffsetPx: 7,
	},
	autumn: {
		id: 'autumn',
		label: t('widgets.pet.background.autumn'),
		image: autumnBackground,
		groundOffsetPx: 3,
	},
	beach: {
		id: 'beach',
		label: t('widgets.pet.background.beach'),
		image: beachBackground,
		groundOffsetPx: 10,
	},
}

export const PET_BACKGROUND_LIST = Object.values(PET_BACKGROUNDS)

export const HUNGER_GAIN_STEPS = [5, 10, 20]

export const HUNGER_TICK_MS = 40 * 1000

export const PET_NAME_SAVE_DEBOUNCE_MS = 500

export const MAX_ACTIVE_PET_FOOD = 3

export const BASE_PET_OPTIONS: PetSettings = {
	petType: PetTypes.DOG,
	background: DEFAULT_PET_BACKGROUND,
	petOptions: {
		[PetTypes.DOG]: {
			name: t('widgets.pet.defaultName.dog'),
			type: 'dog',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CHICKEN]: {
			name: t('widgets.pet.defaultName.chicken'),
			type: 'chicken',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CRAB]: {
			name: t('widgets.pet.defaultName.crab'),
			type: 'crab',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CAT]: {
			name: t('widgets.pet.defaultName.cat'),
			type: 'cat',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.FROG]: {
			name: t('widgets.pet.defaultName.frog'),
			type: 'frog',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.OWL]: {
			name: t('widgets.pet.defaultName.owl'),
			type: 'owl',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.SHEEP]: {
			name: t('widgets.pet.defaultName.sheep'),
			type: 'sheep',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.HEDGEHOG]: {
			name: t('widgets.pet.defaultName.hedgehog'),
			type: 'hedgehog',
			hungryState: { level: 100, lastHungerTick: null },
		},
	},
}
