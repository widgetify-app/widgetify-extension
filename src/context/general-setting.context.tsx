import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import type { FetchedTimezone } from '@/services/hooks/timezone/getTimezones.hook'

export interface GeneralData {
	blurMode: boolean
	analyticsEnabled: boolean
	selected_timezone: FetchedTimezone
	browserBookmarksEnabled: boolean
}

interface GeneralSettingContextType extends GeneralData {
	updateSetting: <K extends keyof GeneralData>(key: K, value: GeneralData[K]) => void
	setAnalyticsEnabled: (value: boolean) => void
	setTimezone: (value: FetchedTimezone) => void
	setBrowserBookmarksEnabled: (value: boolean) => void
}

const DEFAULT_SETTINGS: GeneralData = {
	blurMode: false,
	analyticsEnabled: import.meta.env.FIREFOX ? false : true,
	selected_timezone: {
		label: 'آسیا / تهران',
		value: 'Asia/Tehran',
		offset: '+03:30',
	},
	browserBookmarksEnabled: false,
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
						selected_timezone:
							typeof storedSettings.selected_timezone === 'string'
								? DEFAULT_SETTINGS.selected_timezone
								: storedSettings.selected_timezone,
					})
				}
			} finally {
				setIsInitialized(true)
			}
		}

		loadGeneralSettings()
	}, [])

	const updateSetting = <K extends keyof GeneralData>(
		key: K,
		value: GeneralData[K]
	) => {
		setSettings((prevSettings) => {
			const newSettings = {
				...prevSettings,
				[key]: value,
			}

			setToStorage('generalSettings', newSettings)
			return newSettings
		})
	}

	const setAnalyticsEnabled = (value: boolean) => {
		updateSetting('analyticsEnabled', value)
	}
	const setTimezone = (value: FetchedTimezone) => {
		updateSetting('selected_timezone', value)
	}

	const setBrowserBookmarksEnabled = async (value: boolean) => {
		updateSetting('browserBookmarksEnabled', value)
		Analytics.event(`browser_bookmarks_${value ? 'enabled' : 'disabled'}`)
	}

	if (!isInitialized) {
		return null
	}
	const contextValue: GeneralSettingContextType = {
		blurMode: settings.blurMode,
		analyticsEnabled: settings.analyticsEnabled,
		selected_timezone:
			settings?.selected_timezone || DEFAULT_SETTINGS.selected_timezone,
		updateSetting,
		setAnalyticsEnabled,
		setTimezone,
		browserBookmarksEnabled: settings.browserBookmarksEnabled,
		setBrowserBookmarksEnabled,
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
