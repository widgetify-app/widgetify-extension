import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useChangeFont } from '@/services/hooks/extension/updateSetting.hook'
import { useAuth } from './auth.context'
import { safeAwait } from '@/services/api'
import { showToast } from '@/common/toast'
import { translateError } from '@/utils/translate-error'
import { listenEvent } from '@/common/utils/call-event'

export enum FontFamily {
	Vazir = 'Vazir',
	Samim = 'Samim',
	Pofak = 'Pofak',
	rooyin = 'rooyin',
	Arad = 'Arad',
}

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
	canReOrderWidget: boolean
	toggleCanReOrderWidget: () => void
	showNewBadge: boolean
}

const DEFAULT_SETTINGS: AppearanceData = {
	contentAlignment: 'top',
	fontFamily: FontFamily.Vazir,
}

export const AppearanceContext = createContext<AppearanceContextContextType | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<AppearanceData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)
	const [canReOrderWidget, setCanReOrderWidget] = useState(false)
	const [showNewBadge, setNewBadge] = useState<boolean>(false)
	const { mutateAsync: changeFontAsync } = useChangeFont()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		async function loadSettings() {
			try {
				const [storedSettings, showNewBadgeForReOrderWidgets] = await Promise.all(
					[
						getFromStorage('appearance'),
						getFromStorage('showNewBadgeForReOrderWidgets'),
					]
				)
				if (storedSettings) {
					setSettings({
						...DEFAULT_SETTINGS,
						...storedSettings,
					})
				}

				if (typeof showNewBadgeForReOrderWidgets === 'boolean') {
					setNewBadge(showNewBadgeForReOrderWidgets)
				} else {
					setNewBadge(true)
					await setToStorage('showNewBadgeForReOrderWidgets', true)
				}
			} finally {
				setIsInitialized(true)
			}
		}

		const eventForFont = listenEvent('font_change', async (newFont) => {
			document.body.style.fontFamily = `"${newFont}", sans-serif`
			updateSetting('fontFamily', newFont as FontFamily)
		})

		loadSettings()

		return () => {
			eventForFont()
		}
	}, [])

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
		const currentFont = settings.fontFamily
		updateSetting('fontFamily', value)
		Analytics.event(`set_font_${value}`)
		if (isAuthenticated) {
			const [err] = await safeAwait(changeFontAsync({ font: value }))
			if (err) {
				updateSetting('fontFamily', currentFont)
				return showToast(translateError(err) as any, 'error')
			}
		}
	}

	const toggleCanReOrderWidget = async () => {
		setCanReOrderWidget(!canReOrderWidget)
		if (showNewBadge) {
			setNewBadge(false)
			await setToStorage('showNewBadgeForReOrderWidgets', false)
		}
		Analytics.event('toggle_can_reorder_widget')
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
		contentAlignment: settings.contentAlignment,
		fontFamily: settings.fontFamily,
		updateSetting,
		setContentAlignment,
		setFontFamily,
		canReOrderWidget,
		showNewBadge,
		toggleCanReOrderWidget,
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
