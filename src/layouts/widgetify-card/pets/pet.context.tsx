import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { createContext, useContext, useEffect, useState } from 'react'

export enum PetTypes {
	DOG_AKITA = 'dog-akita',
	CHICKEN = 'chicken',
}
export interface PetSettings {
	enablePets: boolean
	petType: PetTypes | null
	petOptions: Record<
		PetTypes,
		{
			name: string
		}
	>
}

interface PetSettingsContextType extends PetSettings {
	setEnablePets: (value: boolean) => void
	setPetName: (value: string) => void
	setPetType: (value: PetTypes) => void
	getCurrentPetName: () => string
}

const DEFAULT_SETTINGS: PetSettings = {
	enablePets: true,
	petType: null,
	petOptions: {
		[PetTypes.DOG_AKITA]: {
			name: 'آکیتا',
		},
		[PetTypes.CHICKEN]: {
			name: 'قدقدپور',
		},
	},
}

const PetContext = createContext<PetSettingsContextType | undefined>(undefined)

export function PetProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<PetSettings>(DEFAULT_SETTINGS)

	const updateSetting = <K extends keyof PetSettings>(key: K, value: PetSettings[K]) => {
		setSettings((prevSettings) => {
			const newSettings = {
				...prevSettings,
				[key]: value,
			}

			setToStorage('pets', newSettings)
			return newSettings
		})
	}

	useEffect(() => {
		const event = listenEvent('updatedPetSettings', (data) => {
			if (data) {
				setSettings((prevSettings) => ({
					...prevSettings,
					...data,
				}))
				if (data.enablePets !== undefined) {
					updateSetting('enablePets', data.enablePets)
				}
				if (data.petName !== undefined) {
					setPetName(data.petName)
				}
				if (data.petType !== undefined) {
					updateSetting('petType', data.petType)
				}
			}
		})

		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets) {
				setSettings({
					...DEFAULT_SETTINGS,
					...storedPets,
				})
			} else {
				setSettings({
					...DEFAULT_SETTINGS,
					petType: PetTypes.DOG_AKITA,
				})
			}
		}

		load()

		return () => {
			event()
		}
	}, [])

	const setEnablePets = (value: boolean) => {
		updateSetting('enablePets', value)
	}

	const setPetName = (value: string) => {
		if (!settings.petType) {
			return
		}

		const CurrentPet = settings.petOptions[settings.petType]
		if (CurrentPet) {
			CurrentPet.name = value
		}

		updateSetting('petOptions', settings.petOptions)
	}

	const setPetType = (value: PetTypes) => {
		updateSetting('petType', value)
	}

	const getCurrentPetName = () => {
		if (!settings.petType) {
			return ''
		}

		const CurrentPet = settings.petOptions[settings.petType]
		if (CurrentPet) {
			return CurrentPet.name
		}
		return ''
	}

	const contextValue: PetSettingsContextType = {
		...settings,
		setEnablePets,
		setPetType,
		setPetName,
		getCurrentPetName,
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
