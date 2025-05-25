import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { createContext, useContext, useEffect, useState } from 'react'

export enum PetTypes {
	DOG_AKITA = 'dog-akita',
	CHICKEN = 'chicken',
	CRAB = 'crab',
	FROG = 'frog',
	CAT = 'cat',
}
export interface PetSettings {
	enablePets: boolean
	petType: PetTypes | null
	petOptions: Record<
		PetTypes,
		{
			name: string
			emoji: string
			type: 'dog' | 'chicken' | 'crab' | 'frog' | 'cat'
			hungryState: {
				level: number // e.g., 0-100
				lastHungerTick: number | null //timestamp
			}
		}
	>
}

interface PetSettingsContextType extends PetSettings {
	getCurrentPetName: (petType: PetTypes) => string
	levelUpHungryState: (petType: PetTypes) => void
	levelDownHungryState: (petType: PetTypes) => void
	isPetHungry: (petType: PetTypes) => boolean
}
export const BASE_PET_OPTIONS: PetSettings = {
	enablePets: true,
	petType: null,
	petOptions: {
		[PetTypes.DOG_AKITA]: {
			name: 'آکیتا',
			emoji: '🐶',
			type: 'dog',
			hungryState: {
				level: 100,
				lastHungerTick: null,
			},
		},
		[PetTypes.CHICKEN]: {
			name: 'قدقدپور',
			emoji: '🐔',
			type: 'chicken',
			hungryState: {
				level: 100,
				lastHungerTick: null,
			},
		},
		[PetTypes.CRAB]: {
			name: 'چنگولی',
			emoji: '🦀',
			type: 'crab',
			hungryState: {
				level: 100,
				lastHungerTick: null,
			},
		},
		[PetTypes.CAT]: {
			name: 'زردآلو',
			emoji: '🐈',
			type: 'cat',
			hungryState: {
				level: 100,
				lastHungerTick: null,
			},
		},
		[PetTypes.FROG]: {
			name: 'قوری',
			emoji: '🐸',
			type: 'frog',
			hungryState: {
				level: 100,
				lastHungerTick: null,
			},
		},
	},
}

const PetContext = createContext<PetSettingsContextType | undefined>(undefined)

export function PetProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<PetSettings>(BASE_PET_OPTIONS)

	useEffect(() => {
		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets) {
				setSettings({
					...BASE_PET_OPTIONS,
					...storedPets,
					petOptions: {
						...BASE_PET_OPTIONS.petOptions,
						...(storedPets.petOptions || {}),
					},
				})
			} else {
				const initialSettings = {
					...BASE_PET_OPTIONS,
					petType: PetTypes.DOG_AKITA,
				}
				setSettings(initialSettings)
				await setToStorage('pets', initialSettings)
			}
		}

		load()
	}, [])

	useEffect(() => {
		const event = listenEvent('updatedPetSettings', (data) => {
			if (data) {
				setSettings((prevSettings) => {
					const newSettings = { ...prevSettings }

					if (data.petName && data.petType) {
						newSettings.petOptions = {
							...newSettings.petOptions,
							[data.petType]: {
								...newSettings.petOptions[data.petType],
								name: data.petName,
							},
						}
					}

					const updatedSettings: PetSettings = {
						...newSettings,
						enablePets: data.enablePets ?? newSettings.enablePets,
						petType: data.petType !== undefined ? data.petType : newSettings.petType,
					}

					setToStorage('pets', updatedSettings)

					return updatedSettings
				})
			}
		})

		return () => {
			event()
		}
	}, [])

	const getCurrentPetName = (petType: PetTypes) => {
		const CurrentPet = settings.petOptions[petType]
		if (CurrentPet) {
			return CurrentPet.name
		}
		return ''
	}

	const levelUpHungryState = (petType: PetTypes) => {
		setSettings((prevSettings) => {
			const newSettings = { ...prevSettings }

			const pet = newSettings.petOptions[petType]

			if (pet && pet.hungryState.level < 100) {
				pet.hungryState.level += 2
			}

			setToStorage('pets', newSettings)

			return newSettings
		})
	}

	const levelDownHungryState = (petType: PetTypes) => {
		setSettings((prevSettings) => {
			const newSettings = { ...prevSettings }
			if (!newSettings.petType) {
				return prevSettings
			}

			const pet = newSettings.petOptions[petType]

			if (pet && pet.hungryState.level > 0) {
				pet.hungryState.level -= 2
			}

			setToStorage('pets', newSettings)

			return newSettings
		})
	}

	const isPetHungry = (petType: PetTypes): boolean => {
		if (!settings.petOptions[petType]) {
			return false
		}

		const pet = settings.petOptions[petType]
		if (pet.hungryState.level <= 0) {
			return false
		}

		return true
	}

	const contextValue: PetSettingsContextType = {
		...settings,
		getCurrentPetName,
		levelUpHungryState,
		isPetHungry,
		levelDownHungryState,
	}

	return <PetContext.Provider value={contextValue}>{children}</PetContext.Provider>
}

export function usePetContext() {
	const context = useContext(PetContext)

	if (!context) {
		throw new Error('usePetContext must be used within a PetProvider')
	}

	return context
}
