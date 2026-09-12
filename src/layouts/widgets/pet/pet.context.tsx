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
import { BASE_PET_OPTIONS, HUNGER_GAIN_STEPS } from './constants'
import { type PetHungerState, type PetSettings, PetTypes } from './types'

interface PetSettingsContextType extends PetSettings {
	getCurrentPetName: (petType: PetTypes) => string
	levelUpHungryState: (petType: PetTypes) => void
	levelDownHungryState: (petType: PetTypes) => void
	isPetHungry: (petType: PetTypes) => boolean
	getPetHungryState: (petType: PetTypes) => PetHungerState | null
}

const PetContext = createContext<PetSettingsContextType | undefined>(undefined)

export function PetProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<PetSettings>({
		...BASE_PET_OPTIONS,
	})
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
			const storedPets = await getFromStorage('pets')
			if (cancelled) return

			if (storedPets) {
				if (!storedPets.petOptions?.[PetTypes.DOG]?.hungryState) {
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
					petType: PetTypes.DOG,
				}
				setSettings(initialSettings)
				await setToStorage('pets', initialSettings)
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
						background:
							data.background !== undefined
								? data.background
								: newSettings.background,
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

	const getCurrentPetName = useCallback(
		(petType: PetTypes) => settings.petOptions[petType]?.name ?? '',
		[settings]
	)

	const levelUpHungryState = useCallback((petType: PetTypes) => {
		setSettings((prevSettings) => {
			const pet = prevSettings.petOptions[petType]
			if (!pet?.hungryState) return prevSettings

			const gain =
				HUNGER_GAIN_STEPS[Math.floor(Math.random() * HUNGER_GAIN_STEPS.length)]
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
			getCurrentPetName,
			levelUpHungryState,
			isPetHungry,
			levelDownHungryState,
			getPetHungryState,
		}),
		[
			settings,
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
