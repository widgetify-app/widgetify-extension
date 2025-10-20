import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'

export interface VerticalTabsSettings {
	enabled: boolean
}

interface VerticalTabsContextType {
	settings: VerticalTabsSettings
	updateSettings: (settings: Partial<VerticalTabsSettings>) => Promise<void>
	isLoading: boolean
}

const VerticalTabsContext = createContext<VerticalTabsContextType | undefined>(undefined)

export function VerticalTabsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<VerticalTabsSettings>({
		enabled: false,
	})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadSettings()
	}, [])

	const loadSettings = async () => {
		try {
			const savedSettings = await getFromStorage('verticalTabsSettings')
			if (savedSettings) {
				setSettings(savedSettings as VerticalTabsSettings)
			}
		} catch (error) {
			console.error('Error loading vertical tabs settings:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const updateSettings = async (newSettings: Partial<VerticalTabsSettings>) => {
		const updatedSettings = { ...settings, ...newSettings }
		setSettings(updatedSettings)
		await setToStorage('verticalTabsSettings', updatedSettings)
		browser.runtime.sendMessage({
			type: 'VERTICAL_TABS_SETTINGS_UPDATED',
			payload: updatedSettings,
		})
	}

	return (
		<VerticalTabsContext.Provider value={{ settings, updateSettings, isLoading }}>
			{children}
		</VerticalTabsContext.Provider>
	)
}

export function useVerticalTabs() {
	const context = useContext(VerticalTabsContext)
	if (!context) {
		throw new Error('useVerticalTabs must be used within VerticalTabsProvider')
	}
	return context
}
