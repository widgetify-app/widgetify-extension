import { type PetSequence, PetTypes } from '../types'

export const PET_SEQUENCES: Record<PetTypes, PetSequence> = {
	[PetTypes.DOG]: {
		next: {
			'sit-idle': ['walk-right', 'run-right', 'lie'],
			lie: ['walk-right', 'run-right'],
			'walk-right': ['walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'lie', 'walk-right', 'run-right'],
			'run-left': ['sit-idle', 'lie', 'walk-right', 'run-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
	[PetTypes.CHICKEN]: {
		next: {
			'sit-idle': ['walk-right', 'run-right'],
			'walk-right': ['walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'walk-right', 'run-right'],
			'run-left': ['sit-idle', 'walk-right', 'run-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
	[PetTypes.CRAB]: {
		next: {
			'sit-idle': ['walk-right', 'run-right'],
			'walk-right': ['walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'walk-right', 'run-right'],
			'run-left': ['sit-idle', 'walk-right', 'run-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
	[PetTypes.FROG]: {
		next: {
			'sit-idle': ['walk-right', 'run-right'],
			'walk-right': ['walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'lie'],
			'run-left': ['sit-idle', 'lie'],
			lie: ['walk-right', 'run-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
	[PetTypes.CAT]: {
		next: {
			'sit-idle': ['walk-right', 'run-right', 'lie'],
			lie: ['walk-right', 'walk-left'],
			'walk-right': ['walk-left', 'walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'lie', 'walk-right', 'walk-right', 'run-right'],
			'run-left': ['sit-idle', 'lie', 'walk-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
	[PetTypes.OWL]: {
		next: {
			'sit-idle': ['walk-right', 'run-right', 'lie'],
			lie: ['walk-right', 'run-right'],
			'walk-right': ['walk-left', 'run-left'],
			'run-right': ['walk-left', 'run-left'],
			'walk-left': ['sit-idle', 'lie', 'walk-right', 'run-right'],
			'run-left': ['sit-idle', 'lie', 'walk-right', 'run-right'],
			chase: ['eat'],
			eat: ['walk-right', 'walk-left', 'run-left', 'run-right'],
		},
	},
}
