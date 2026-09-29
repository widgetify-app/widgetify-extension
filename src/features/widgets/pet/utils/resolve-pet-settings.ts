import { type PetMeta, type PetSettings, PetTypes } from '../types'

const PET_TYPES = Object.values(PetTypes)

function isPetType(value: unknown): value is PetTypes {
	return PET_TYPES.includes(value as PetTypes)
}

export function mergePetMeta(
	base: PetMeta | undefined,
	overrides: PetMeta | undefined
): PetMeta {
	const merged: PetMeta = { ...base }
	if (overrides?.petType !== undefined) merged.petType = overrides.petType
	if (overrides?.petName !== undefined) merged.petName = overrides.petName
	if (overrides?.background !== undefined) merged.background = overrides.background
	return merged
}

export function resolvePetSettings(
	defaults: PetSettings,
	stored: PetSettings | null,
	meta: PetMeta | undefined
): PetSettings {
	const petOptions = {} as PetSettings['petOptions']
	for (const type of PET_TYPES) {
		const persisted = stored?.petOptions?.[type]
		petOptions[type] = {
			...defaults.petOptions[type],
			...persisted,
			hungryState: persisted?.hungryState ?? defaults.petOptions[type].hungryState,
		}
	}

	const petType =
		[meta?.petType, stored?.petType, defaults.petType].find(isPetType) ?? PetTypes.DOG
	const background = meta?.background ?? stored?.background ?? defaults.background

	if (meta?.petName) {
		petOptions[petType] = { ...petOptions[petType], name: meta.petName }
	}

	return { petType, background, petOptions }
}
