import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { createContext, useContext, useEffect, useState } from 'react'

// export enum PetKeys {
// 	akita = 'akita',
// 	chicken = 'chicken',
// }

// export const Pets: Record<PetKeys, any> = {
// 	[PetKeys.akita]: {
// 		name: 'آکیتا',
// 		petType: 'dog',
// 		animates: {},
// 		speeds: {},
// 		instance: null, // a reference to the pet instance
// 	},
// 	[PetKeys.chicken]: {
// 		name: 'مرغ',
// 		petType: 'chicken',
// 		animates: {},
// 		speeds: {},
// 		instance: null, // a reference to the pet instance
// 	},
// }

interface PetSettings {
	enablePets: boolean
	petName: string
}

interface PetSettingsContextType extends PetSettings {
	setEnablePets: (value: boolean) => void
	setPetName: (value: string) => void
}

const DEFAULT_SETTINGS: PetSettings = {
	enablePets: true,
	petName: 'آکیتا',
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
				updateSetting('enablePets', data.enablePets)
				updateSetting('petName', data.petName)
			}
		})

		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets) {
				setSettings({
					...DEFAULT_SETTINGS,
					...storedPets,
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
		updateSetting('petName', value)
	}

	const contextValue: PetSettingsContextType = {
		...settings,
		setEnablePets,
		setPetName,
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
