import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useUpdateExtensionSettings } from '@/services/hooks/extension/updateSetting.hook'
import { useAuth } from './auth.context'

export type FontFamily = 'Vazir' | 'Samim' | 'Pofak' | 'rooyin'

export interface AppearanceData {
	contentAlignment: 'center' | 'top'
	fontFamily: FontFamily
}

interface AppearanceContextContextType extends AppearanceData {
	updateSetting: <K extends keyof AppearanceData>(
		key: K,
		value: AppearanceData[K]
	) => void
	setContentAlignment: (value: 'center' | 'top') => void
	setFontFamily: (value: FontFamily) => void
}

const DEFAULT_SETTINGS: AppearanceData = {
	contentAlignment: 'top',
	fontFamily: 'Vazir',
}

export const AppearanceContext = createContext<AppearanceContextContextType | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<AppearanceData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)
	const { mutateAsync: updateSettings } = useUpdateExtensionSettings()
	const { isAuthenticated, user } = useAuth()

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

	useEffect(() => {
		if (user) {
			if (user && user.font !== settings.fontFamily) {
				setSettings({
					...settings,
					fontFamily: user.font || DEFAULT_SETTINGS.fontFamily,
				})
			}
		}
	}, [user])

	const updateSetting = <K extends keyof AppearanceData>(
		key: K,
		value: AppearanceData[K]
	) => {
		setSettings((prevSettings) => {
			const newSettings = {
				...prevSettings,
				[key]: value,
			}

			setToStorage('appearance', newSettings)
			return newSettings
		})
	}

	const setContentAlignment = (value: 'center' | 'top') => {
		updateSetting('contentAlignment', value)
		Analytics.event(`set_content_alignment_${value}`)
	}

	const setFontFamily = async (value: FontFamily) => {
		updateSetting('fontFamily', value)
		if (isAuthenticated) {
			await updateSettings({ font: value })
		}
		Analytics.event(`set_font_${value}`)
	}

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
