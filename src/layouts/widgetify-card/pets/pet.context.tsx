import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
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
			emoji: '🐱',
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

const HUNGER_GAIN_STEPS = [10, 15, 25]

const PetContext = createContext<PetSettingsContextType | undefined>(undefined)

export function PetProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<PetSettings>({
		...BASE_PET_OPTIONS,
	})
	const [isEnabled, setIsEnabled] = useState(false)
	const pendingPersistRef = useRef<PetSettings | null>(null)

	useEffect(() => {
		const pending = pendingPersistRef.current
		if (!pending) return
		pendingPersistRef.current = null
		setToStorage('pets', pending)
	})

	useEffect(() => {
		let cancelled = false

		async function load() {
			const [storedPets, petState] = await Promise.all([
				getFromStorage('pets'),
				getFromStorage('petState'),
			])
			if (cancelled) return

			if (storedPets) {
				if (!storedPets.petOptions?.[PetTypes.DOG_AKITA]?.hungryState) {
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

		load().catch((err) => {
			console.error('Failed to load pet settings', err)
		})

		return () => {
			cancelled = true
		}
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

	const getCurrentPetName = useCallback(
		(petType: PetTypes) => settings.petOptions[petType]?.name ?? '',
		[settings]
	)

	const levelUpHungryState = useCallback((petType: PetTypes) => {
		setSettings((prevSettings) => {
			const pet = prevSettings.petOptions[petType]
			if (!pet?.hungryState) return prevSettings

			const gain = HUNGER_GAIN_STEPS[Math.floor(Math.random() * HUNGER_GAIN_STEPS.length)]
			const nextLevel = Math.min(100, pet.hungryState.level + gain)
			if (nextLevel === pet.hungryState.level) return prevSettings

			const newSettings: PetSettings = {
				...prevSettings,
				petOptions: {
					...prevSettings.petOptions,
					[petType]: {
						...pet,
						hungryState: { ...pet.hungryState, level: nextLevel },
					},
				},
			}

			pendingPersistRef.current = newSettings
			return newSettings
		})
	}, [])

	const levelDownHungryState = useCallback((petType: PetTypes) => {
		setSettings((prevSettings) => {
			if (!prevSettings.petType) return prevSettings

			const pet = prevSettings.petOptions[petType]
			if (!pet?.hungryState) return prevSettings

			const PER_SEC = 40 * 1000

			if (pet.hungryState.lastHungerTick) {
				const timeDiff = Date.now() - pet.hungryState.lastHungerTick
				if (timeDiff < PER_SEC) {
					return prevSettings
				}
			}

			if (pet.hungryState.level <= 0) return prevSettings

			const newSettings: PetSettings = {
				...prevSettings,
				petOptions: {
					...prevSettings.petOptions,
					[petType]: {
						...pet,
						hungryState: {
							...pet.hungryState,
							level: pet.hungryState.level - 1,
							lastHungerTick: Date.now(),
						},
					},
				},
			}

			pendingPersistRef.current = newSettings
			return newSettings
		})
	}, [])

	const getPetHungryState = useCallback(
		(petType: PetTypes) => settings.petOptions[petType]?.hungryState ?? null,
		[settings]
	)

	const isPetHungry = useCallback(
		(petType: PetTypes): boolean => {
			const pet = settings.petOptions[petType]
			return !(pet?.hungryState?.level && pet.hungryState.level > 0)
		},
		[settings]
	)

	const contextValue = useMemo<PetSettingsContextType>(
		() => ({
			...settings,
			isEnabled,
			getCurrentPetName,
			levelUpHungryState,
			isPetHungry,
			levelDownHungryState,
			getPetHungryState,
			setIsEnabled,
		}),
		[
			settings,
			isEnabled,
			getCurrentPetName,
			levelUpHungryState,
			isPetHungry,
			levelDownHungryState,
			getPetHungryState,
		]
	)

	return <PetContext.Provider value={contextValue}>{children}</PetContext.Provider>
}

export function usePetContext() {
	const context = useContext(PetContext)

	if (!context) {
		throw new Error('usePetContext must be used within a PetProvider')
	}

	return context
}
