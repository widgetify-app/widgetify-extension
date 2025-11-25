import { createContext, useContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'

export enum PetTypes {
	DOG_AKITA = 'dog-akita',
	CHICKEN = 'chicken',
	CRAB = 'crab',
	FROG = 'frog',
	CAT = 'cat',
}
export interface PetSettings {
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
	getPetHungryState: (petType: PetTypes) => {
		level: number
		lastHungerTick: number | null
	} | null
	isEnabled: boolean
	setIsEnabled: (value: boolean) => void
}
export const BASE_PET_OPTIONS: PetSettings = {
	petType: PetTypes.DOG_AKITA,
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
	const [settings, setSettings] = useState<PetSettings>({
		...BASE_PET_OPTIONS,
	})
	const [isEnabled, setIsEnabled] = useState(false)

	useEffect(() => {
		async function load() {
			// const storedPets = await getFromStorage('pets')
			const [storedPets, petState] = await Promise.all([
				getFromStorage('pets'),
				getFromStorage('petState'),
			])
			if (storedPets) {
				if (!storedPets.petOptions['dog-akita'].hungryState) {
					setToStorage('pets', {
						...BASE_PET_OPTIONS,
					})
					setSettings({
						...BASE_PET_OPTIONS,
					})
				} else {
					setSettings({
						...BASE_PET_OPTIONS,
						...storedPets,
						petOptions: {
							...BASE_PET_OPTIONS.petOptions,
							...(storedPets.petOptions || {}),
						},
					})
				}
			} else {
				const initialSettings = {
					...BASE_PET_OPTIONS,
					petType: PetTypes.DOG_AKITA,
				}
				setSettings(initialSettings)
				await setToStorage('pets', initialSettings)
			}

			if (typeof petState === 'boolean') {
				setIsEnabled(petState)
			} else {
				setIsEnabled(true)
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
						petType:
							data.petType !== undefined
								? data.petType
								: newSettings.petType,
					}

					setToStorage('pets', updatedSettings)

					return updatedSettings
				})
			}
		})

		const event2 = listenEvent('updatedPetState', (data) => {
			setIsEnabled(data)
			setToStorage('petState', data)
		})

		return () => {
			event()
			event2()
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

			if (pet && pet.hungryState?.level < 100) {
				pet.hungryState.level += [10, 15, 25][Math.floor(Math.random() * 2)]
			}

			if (pet.hungryState?.level > 100) {
				pet.hungryState.level = 100
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

			const PER_SEC = 40 * 1000

			if (pet?.hungryState?.lastHungerTick) {
				const timeDiff = Date.now() - pet.hungryState.lastHungerTick
				if (timeDiff < PER_SEC) {
					return prevSettings
				}
			}

			if (pet && pet.hungryState?.level > 0) {
				const hungerDecrease = 1
				pet.hungryState.level -= hungerDecrease
				pet.hungryState.lastHungerTick = Date.now()
			}

			setToStorage('pets', newSettings)

			return newSettings
		})
	}

	const getPetHungryState = (petType: PetTypes) => {
		const pet = settings.petOptions[petType]
		if (pet) {
			return pet.hungryState
		}
		return null
	}

	const isPetHungry = (petType: PetTypes): boolean => {
		const pet = settings.petOptions[petType]
		if (pet.hungryState?.level > 0) {
			return false
		}

		return true
	}

	const contextValue: PetSettingsContextType = {
		...settings,
		isEnabled,
		getCurrentPetName,
		levelUpHungryState,
		isPetHungry,
		levelDownHungryState,
		getPetHungryState,
		setIsEnabled,
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
