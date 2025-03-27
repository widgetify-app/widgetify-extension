import { getFromStorage, setToStorage } from '@/common/storage'
import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type FontFamily = 'Vazir' | 'digiLalezarPlus' | 'Behdad' | 'Samim'

export interface GeneralData {
	analyticsEnabled: boolean
	enablePets: boolean
	contentAlignment: 'center' | 'top'
	petName: string
	fontFamily: FontFamily
}

interface GeneralSettingContextType extends GeneralData {
	updateSetting: <K extends keyof GeneralData>(key: K, value: GeneralData[K]) => void
	setEnablePets: (value: boolean) => void
	setAnalyticsEnabled: (value: boolean) => void
	setPetName: (value: string) => void
	setContentAlignment: (value: 'center' | 'top') => void
	setFontFamily: (value: FontFamily) => void
}

const DEFAULT_SETTINGS: GeneralData = {
	analyticsEnabled: true,
	enablePets: true,
	contentAlignment: 'center',
	petName: 'آکیتا',
	fontFamily: 'Vazir',
}

export const GeneralSettingContext = createContext<GeneralSettingContextType | null>(null)

export function GeneralSettingProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<GeneralData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		async function loadGeneralSettings() {
			try {
				const storedSettings = await getFromStorage('generalSettings')

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
				const newSettings = {
					...prevSettings,
					[key]: value,
				}

				setToStorage('generalSettings', newSettings)
				return newSettings
			})
		},
		[],
	)

	const setEnablePets = useCallback(
		(value: boolean) => {
			updateSetting('enablePets', value)
		},
		[updateSetting],
	)

	const setAnalyticsEnabled = useCallback(
		(value: boolean) => {
			updateSetting('analyticsEnabled', value)
		},
		[updateSetting],
	)

	const setPetName = useCallback(
		(value: string) => {
			updateSetting('petName', value)
		},
		[updateSetting],
	)

	const setContentAlignment = useCallback(
		(value: 'center' | 'top') => {
			updateSetting('contentAlignment', value)
		},
		[updateSetting],
	)

	const setFontFamily = useCallback(
		(value: FontFamily) => {
			updateSetting('fontFamily', value)
		},
		[updateSetting],
	)

	useEffect(() => {
		if (isInitialized && settings.fontFamily) {
			document.body.style.fontFamily = `"${settings.fontFamily}", sans-serif`
		}
	}, [isInitialized, settings.fontFamily])

	if (!isInitialized) {
		return null
	}

	const contextValue: GeneralSettingContextType = {
		...settings,
		updateSetting,
		setEnablePets,
		setAnalyticsEnabled,
		setPetName,
		setContentAlignment,
		setFontFamily,
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

	return context
}
