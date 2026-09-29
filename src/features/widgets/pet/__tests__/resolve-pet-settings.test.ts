import { describe, expect, it } from 'bun:test'
import { type PetSettings, PetTypes } from '../types'
import { mergePetMeta, resolvePetSettings } from '../utils/resolve-pet-settings'

const defaults: PetSettings = {
	petType: PetTypes.DOG,
	background: 'none',
	petOptions: {
		[PetTypes.DOG]: {
			name: 'Akita',
			type: 'dog',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CHICKEN]: {
			name: 'Chicken',
			type: 'chicken',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CRAB]: {
			name: 'Crab',
			type: 'crab',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.CAT]: {
			name: 'Cat',
			type: 'cat',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.FROG]: {
			name: 'Frog',
			type: 'frog',
			hungryState: { level: 100, lastHungerTick: null },
		},
		[PetTypes.OWL]: {
			name: 'Owl',
			type: 'owl',
			hungryState: { level: 100, lastHungerTick: null },
		},
	},
}

function stored(overrides: Partial<PetSettings> = {}): PetSettings {
	return { ...defaults, ...overrides }
}

describe('resolvePetSettings precedence', () => {
	it('uses the built-in defaults when nothing is stored and there is no meta', () => {
		const result = resolvePetSettings(defaults, null, undefined)
		expect(result.petType).toBe(PetTypes.DOG)
		expect(result.background).toBe('none')
		expect(result.petOptions[PetTypes.DOG].name).toBe('Akita')
	})

	it('follows the global choice when the widget has no choice of its own', () => {
		const result = resolvePetSettings(
			defaults,
			stored({ petType: PetTypes.CAT, background: 'forest' }),
			undefined
		)
		expect(result.petType).toBe(PetTypes.CAT)
		expect(result.background).toBe('forest')
	})

	it('lets the widget choice beat the global choice', () => {
		const result = resolvePetSettings(
			defaults,
			stored({ petType: PetTypes.CAT, background: 'forest' }),
			{ petType: PetTypes.OWL, background: 'tehran', petName: 'Joghdoo' }
		)
		expect(result.petType).toBe(PetTypes.OWL)
		expect(result.background).toBe('tehran')
		expect(result.petOptions[PetTypes.OWL].name).toBe('Joghdoo')
	})

	it('falls back field by field, not all or nothing', () => {
		const result = resolvePetSettings(
			defaults,
			stored({ petType: PetTypes.CAT, background: 'beach' }),
			{ petType: PetTypes.FROG }
		)
		expect(result.petType).toBe(PetTypes.FROG)
		expect(result.background).toBe('beach')
	})

	it('applies a widget name only to the active species', () => {
		const result = resolvePetSettings(defaults, null, {
			petType: PetTypes.CAT,
			petName: 'Tom',
		})
		expect(result.petOptions[PetTypes.CAT].name).toBe('Tom')
		expect(result.petOptions[PetTypes.DOG].name).toBe('Akita')
	})

	it('keeps the stored name of a species when the widget only sets its type', () => {
		const persisted = stored({
			petOptions: {
				...defaults.petOptions,
				[PetTypes.CAT]: {
					...defaults.petOptions[PetTypes.CAT],
					name: 'Whiskers',
				},
			},
		})
		const result = resolvePetSettings(defaults, persisted, { petType: PetTypes.CAT })
		expect(result.petOptions[PetTypes.CAT].name).toBe('Whiskers')
	})

	it('ignores an empty widget name', () => {
		const result = resolvePetSettings(defaults, null, {
			petType: PetTypes.DOG,
			petName: '',
		})
		expect(result.petOptions[PetTypes.DOG].name).toBe('Akita')
	})
})

describe('resolvePetSettings stored data', () => {
	it('keeps the hunger of every species from storage', () => {
		const persisted = stored({
			petOptions: {
				...defaults.petOptions,
				[PetTypes.DOG]: {
					...defaults.petOptions[PetTypes.DOG],
					hungryState: { level: 12, lastHungerTick: 99 },
				},
			},
		})
		const result = resolvePetSettings(defaults, persisted, undefined)
		expect(result.petOptions[PetTypes.DOG].hungryState).toEqual({
			level: 12,
			lastHungerTick: 99,
		})
		expect(result.petOptions[PetTypes.CAT].hungryState.level).toBe(100)
	})

	it('adds species that an older stored value does not know about', () => {
		const { [PetTypes.OWL]: _owl, ...withoutOwl } = defaults.petOptions
		const legacy = stored({ petOptions: withoutOwl as PetSettings['petOptions'] })
		const result = resolvePetSettings(defaults, legacy, { petType: PetTypes.OWL })
		expect(result.petOptions[PetTypes.OWL].name).toBe('Owl')
		expect(result.petOptions[PetTypes.OWL].hungryState.level).toBe(100)
	})

	it('never returns a species value the app does not have', () => {
		const corrupt = stored({ petType: 'dragon' as PetTypes })
		expect(resolvePetSettings(defaults, corrupt, undefined).petType).toBe(
			PetTypes.DOG
		)
		expect(
			resolvePetSettings(defaults, corrupt, { petType: 'unicorn' as PetTypes })
				.petType
		).toBe(PetTypes.DOG)
	})

	it('survives a stored value that has no species table', () => {
		const broken = {
			petType: PetTypes.CAT,
			background: 'none',
		} as unknown as PetSettings
		const result = resolvePetSettings(defaults, broken, undefined)
		expect(result.petType).toBe(PetTypes.CAT)
		expect(result.petOptions[PetTypes.CAT].name).toBe('Cat')
	})
})

describe('mergePetMeta', () => {
	it('overrides only the fields that are set', () => {
		expect(
			mergePetMeta(
				{ petType: PetTypes.DOG, petName: 'Rex', background: 'forest' },
				{ petName: 'Max' }
			)
		).toEqual({ petType: PetTypes.DOG, petName: 'Max', background: 'forest' })
	})

	it('ignores undefined overrides and handles a missing base', () => {
		expect(
			mergePetMeta(undefined, { petType: PetTypes.CAT, background: undefined })
		).toEqual({
			petType: PetTypes.CAT,
		})
		expect(mergePetMeta({ petType: PetTypes.DOG }, undefined)).toEqual({
			petType: PetTypes.DOG,
		})
	})
})
