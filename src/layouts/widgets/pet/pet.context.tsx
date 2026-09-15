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
import { BASE_PET_OPTIONS, HUNGER_GAIN_STEPS, HUNGER_TICK_MS } from './constants'
import {
	type PetBackgroundId,
	type PetHungerState,
	type PetMeta,
	type PetSettings,
	PetTypes,
} from './types'

interface PetSettingsContextType extends PetSettings {
	getCurrentPetName: (petType: PetTypes) => string
	levelUpHungryState: (petType: PetTypes) => void
	levelDownHungryState: (petType: PetTypes) => void
	isPetHungry: (petType: PetTypes) => boolean
	getPetHungryState: (petType: PetTypes) => PetHungerState | null
}

const PetContext = createContext<PetSettingsContextType | undefined>(undefined)

interface PetProviderProps {
	children: React.ReactNode
	meta?: PetMeta
	instanceId?: string
}

export function PetProvider({ children, meta, instanceId }: PetProviderProps) {
	const [settings, setSettings] = useState<PetSettings>({
		...BASE_PET_OPTIONS,
		petType: meta?.petType || BASE_PET_OPTIONS.petType,
		background: meta?.background || BASE_PET_OPTIONS.background,
		petOptions: {
			...BASE_PET_OPTIONS.petOptions,
			...(meta?.petType && meta?.petName
				? {
						[meta.petType]: {
							...BASE_PET_OPTIONS.petOptions[meta.petType],
							name: meta.petName,
						},
					}
				: {}),
		},
	})
	const pendingPersistRef = useRef<PetSettings | null>(null)

	useEffect(() => {
		if (meta) {
			setSettings((prev) => {
				const activeType = meta.petType || prev.petType || PetTypes.DOG
				return {
					...prev,
					petType: activeType,
					background: meta.background ?? prev.background,
					petOptions: {
						...prev.petOptions,
						...(meta.petName
							? {
									[activeType]: {
										...prev.petOptions[activeType],
										name: meta.petName,
									},
								}
							: {}),
					},
				}
			})
		}
	}, [meta])

	useEffect(() => {
		const pending = pendingPersistRef.current
		if (!pending) return
		pendingPersistRef.current = null

		if (instanceId) {
			getFromStorage('pets').then((storedPets) => {
				const mergedPetOptions = {
					...(storedPets?.petOptions || BASE_PET_OPTIONS.petOptions),
				}
				for (const type of Object.values(PetTypes)) {
					if (pending.petOptions[type]?.hungryState) {
						mergedPetOptions[type] = {
							...(mergedPetOptions[type] || BASE_PET_OPTIONS.petOptions[type]),
							hungryState: pending.petOptions[type].hungryState,
						}
					}
				}
				setToStorage('pets', {
					...(storedPets || BASE_PET_OPTIONS),
					petOptions: mergedPetOptions,
				})
			})
		} else {
			setToStorage('pets', pending)
		}
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
					setSettings(() => ({
						...BASE_PET_OPTIONS,
						petType: meta?.petType || BASE_PET_OPTIONS.petType,
						background: meta?.background || BASE_PET_OPTIONS.background,
						petOptions: {
							...BASE_PET_OPTIONS.petOptions,
							...(meta?.petType && meta?.petName
								? {
										[meta.petType]: {
											...BASE_PET_OPTIONS.petOptions[meta.petType],
											name: meta.petName,
										},
									}
								: {}),
						},
					}))
				} else {
					setSettings((prev) => {
						const mergedOptions = {
							...BASE_PET_OPTIONS.petOptions,
							...(storedPets.petOptions || {}),
						}
						// If running as an instance, isolate petType, background, and petName in meta
						const resolvedType: PetTypes = (instanceId
							? meta?.petType || BASE_PET_OPTIONS.petType
							: meta?.petType || storedPets.petType || prev.petType || PetTypes.DOG) || PetTypes.DOG

						const resolvedBackground: PetBackgroundId = (instanceId
							? meta?.background || BASE_PET_OPTIONS.background
							: meta?.background || storedPets.background || prev.background) || BASE_PET_OPTIONS.background

						if (instanceId) {
							if (meta?.petName) {
								mergedOptions[resolvedType] = {
									...mergedOptions[resolvedType],
									name: meta.petName,
								}
							}
						} else if (meta?.petName) {
							mergedOptions[resolvedType] = {
								...mergedOptions[resolvedType],
								name: meta.petName,
							}
						}

						return {
							...BASE_PET_OPTIONS,
							...(instanceId ? {} : storedPets),
							petType: resolvedType,
							background: resolvedBackground,
							petOptions: mergedOptions,
						}
					})
				}
			} else {
				const initialSettings = {
					...BASE_PET_OPTIONS,
					petType: meta?.petType || PetTypes.DOG,
					background: meta?.background || BASE_PET_OPTIONS.background,
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
	}, [meta])

	useEffect(() => {
		const event = listenEvent('updatedPetSettings', (data) => {
			if (data) {
				if (data.instanceId && instanceId && data.instanceId !== instanceId) {
					return
				}

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

					if (!data.instanceId) {
						setToStorage('pets', updatedSettings)
					}

					return updatedSettings
				})
			}
		})

		return () => {
			event()
		}
	}, [instanceId])

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

			if (pet.hungryState.lastHungerTick) {
				const sinceLastTick = Date.now() - pet.hungryState.lastHungerTick
				if (sinceLastTick < HUNGER_TICK_MS) {
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
