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

	useEffect(() => {
		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets) {
				setSettings({
					...DEFAULT_SETTINGS,
					...storedPets,
					petOptions: {
						...DEFAULT_SETTINGS.petOptions,
						...(storedPets.petOptions || {}),
					},
				})
			} else {
				const initialSettings = {
					...DEFAULT_SETTINGS,
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
