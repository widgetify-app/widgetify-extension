import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

export interface GeneralData {
	analyticsEnabled: boolean
	enablePets: boolean
	contentAlignment: 'center' | 'top'
	petName: string
}

interface GeneralSettingContextType extends GeneralData {
	updateSetting: <K extends keyof GeneralData>(key: K, value: GeneralData[K]) => void
}

const DEFAULT_SETTINGS: GeneralData = {
	analyticsEnabled: true,
	enablePets: true,
	contentAlignment: 'center',
	petName: 'آکیتا',
}

export const GeneralSettingContext = createContext<GeneralSettingContextType | null>(null)

export function GeneralSettingProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<GeneralData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		async function loadGeneralSettings() {
			try {
				const storedSettings = await getFromStorage<GeneralData>(StoreKey.General_setting)

				if (storedSettings) {
					setSettings({
						...DEFAULT_SETTINGS,
						...storedSettings,
					})
				}
			} finally {
				setIsInitialized(true)
			}
		}

		loadGeneralSettings()
	}, [])

	const updateSetting = useCallback(
		<K extends keyof GeneralData>(key: K, value: GeneralData[K]) => {
			setSettings((prevSettings) => {
				const finalValue =
					key === 'petName' && value === '' ? DEFAULT_SETTINGS.petName : value

				const newSettings = {
					...prevSettings,
					[key]: finalValue,
				}

				setToStorage(StoreKey.General_setting, newSettings)

				return newSettings
			})
		},
		[],
	)

	if (!isInitialized) {
		return null
	}

	const contextValue: GeneralSettingContextType = {
		...settings,
		updateSetting,
	}

	return (
		<GeneralSettingContext.Provider value={contextValue}>
			{children}
		</GeneralSettingContext.Provider>
	)
}

export function useGeneralSetting() {
	const context = useContext(GeneralSettingContext)

	if (!context) {
		throw new Error('useGeneralSetting must be used within a GeneralSettingProvider')
	}

	return {
		...context,
		setEnablePets: (value: boolean) => context.updateSetting('enablePets', value),
		setAnalyticsEnabled: (value: boolean) =>
			context.updateSetting('analyticsEnabled', value),
		setPetName: (value: string) => context.updateSetting('petName', value),
		setContentAlignment: (value: 'center' | 'top') =>
			context.updateSetting('contentAlignment', value),
	}
}
