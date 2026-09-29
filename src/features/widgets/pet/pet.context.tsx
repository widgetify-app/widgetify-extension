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
import { mergePetMeta, resolvePetSettings } from './utils/resolve-pet-settings'
import { type PetHungerState, type PetMeta, type PetSettings, PetTypes } from './types'

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
	const [stored, setStored] = useState<PetSettings | null>(null)
	const [live, setLive] = useState<PetMeta>({})
	const storedRef = useRef<PetSettings | null>(null)
	const pendingHungerRef = useRef<PetSettings | null>(null)

	const applyStored = useCallback((next: PetSettings) => {
		storedRef.current = next
		setStored(next)
	}, [])

	useEffect(() => {
		setLive({})
	}, [meta])

	useEffect(() => {
		let cancelled = false

		async function load() {
			const persisted = await getFromStorage('pets')
			if (cancelled) return

			if (persisted?.petOptions?.[PetTypes.DOG]?.hungryState) {
				applyStored(persisted)
				return
			}

			applyStored(BASE_PET_OPTIONS)
			await setToStorage('pets', BASE_PET_OPTIONS)
		}

		load().catch((err) => {
			console.error('Failed to load pet settings', err)
		})

		return () => {
			cancelled = true
		}
	}, [applyStored])

	useEffect(
		() =>
			listenEvent('updatedPetSettings', (data) => {
				if (!data) return

				if (data.instanceId) {
					if (data.instanceId !== instanceId) return
					setLive((previous) =>
						mergePetMeta(previous, {
							petType: data.petType,
							petName: data.petName,
							background: data.background,
						})
					)
					return
				}

				getFromStorage('pets').then((persisted) => {
					if (persisted) applyStored(persisted)
				})
			}),
		[instanceId, applyStored]
	)

	useEffect(() => {
		const pending = pendingHungerRef.current
		if (!pending) return
		pendingHungerRef.current = null

		getFromStorage('pets').then((persisted) => {
			const base = persisted ?? BASE_PET_OPTIONS
			const petOptions = { ...base.petOptions }
			for (const type of Object.values(PetTypes)) {
				const hungryState = pending.petOptions[type]?.hungryState
				if (hungryState) {
					petOptions[type] = {
						...(petOptions[type] ?? BASE_PET_OPTIONS.petOptions[type]),
						hungryState,
					}
				}
			}
			setToStorage('pets', { ...base, petOptions })
		})
	})

	const settings = useMemo(
		() => resolvePetSettings(BASE_PET_OPTIONS, stored, mergePetMeta(meta, live)),
		[stored, meta, live]
	)

	const updateHunger = useCallback(
		(
			petType: PetTypes,
			change: (current: PetHungerState) => PetHungerState | null
		) => {
			const base = storedRef.current ?? BASE_PET_OPTIONS
			const pet = base.petOptions[petType]
			if (!pet?.hungryState) return

			const hungryState = change(pet.hungryState)
			if (!hungryState) return

			const next: PetSettings = {
				...base,
				petOptions: { ...base.petOptions, [petType]: { ...pet, hungryState } },
			}
			pendingHungerRef.current = next
			applyStored(next)
		},
		[applyStored]
	)

	const getCurrentPetName = useCallback(
		(petType: PetTypes) => settings.petOptions[petType]?.name ?? '',
		[settings]
	)

	const levelUpHungryState = useCallback(
		(petType: PetTypes) => {
			updateHunger(petType, (current) => {
				const gain =
					HUNGER_GAIN_STEPS[
						Math.floor(Math.random() * HUNGER_GAIN_STEPS.length)
					]
				const level = Math.min(100, current.level + gain)
				return level === current.level ? null : { ...current, level }
			})
		},
		[updateHunger]
	)

	const levelDownHungryState = useCallback(
		(petType: PetTypes) => {
			updateHunger(petType, (current) => {
				if (
					current.lastHungerTick &&
					Date.now() - current.lastHungerTick < HUNGER_TICK_MS
				) {
					return null
				}
				if (current.level <= 0) return null
				return { level: current.level - 1, lastHungerTick: Date.now() }
			})
		},
		[updateHunger]
	)

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
