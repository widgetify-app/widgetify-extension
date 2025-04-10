import { getFromStorage, setToStorage } from '@/common/storage'
import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type FontFamily = 'Vazir' | 'Samim'

export interface AppearanceData {
	contentAlignment: 'center' | 'top'
	fontFamily: FontFamily
}

interface AppearanceContextContextType extends AppearanceData {
	updateSetting: <K extends keyof AppearanceData>(
		key: K,
		value: AppearanceData[K],
	) => void
	setContentAlignment: (value: 'center' | 'top') => void
	setFontFamily: (value: FontFamily) => void
}

const DEFAULT_SETTINGS: AppearanceData = {
	contentAlignment: 'center',
	fontFamily: 'Vazir',
}

export const AppearanceContext = createContext<AppearanceContextContextType | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<AppearanceData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		async function loadSettings() {
			try {
				const storedSettings = await getFromStorage('appearance')

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

		loadSettings()
	}, [])

	const updateSetting = useCallback(
		<K extends keyof AppearanceData>(key: K, value: AppearanceData[K]) => {
			setSettings((prevSettings) => {
				const newSettings = {
					...prevSettings,
					[key]: value,
				}

				setToStorage('appearance', newSettings)
				return newSettings
			})
		},
		[],
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

	const contextValue: AppearanceContextContextType = {
		...settings,
		updateSetting,
		setContentAlignment,
		setFontFamily,
	}

	return (
		<AppearanceContext.Provider value={contextValue}>
			{children}
		</AppearanceContext.Provider>
	)
}

export function useAppearanceSetting() {
	const context = useContext(AppearanceContext)

	if (!context) {
		throw new Error('useAppearanceSetting must be used within a AppearanceProvider')
	}

	return context
}
