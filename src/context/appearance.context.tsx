import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useChangeFont, useChangeUI } from '@/services/hooks/extension/updateSetting.hook'
import { useAuth } from './auth.context'
import { safeAwait } from '@/services/api'
import { showToast } from '@/common/toast'
import { translateError } from '@/utils/translate-error'
import { listenEvent } from '@/common/utils/call-event'

type UI = 'SIMPLE' | 'ADVANCED'
export interface AppearanceData {
	contentAlignment: 'center' | 'top'
	fontFamily: string
	ui: UI
}
interface AppearanceContextContextType extends AppearanceData {
	updateSetting: <K extends keyof AppearanceData>(
		key: K,
		value: AppearanceData[K]
	) => void
	setContentAlignment: (value: 'center' | 'top') => void
	setFontFamily: (value: string) => void
	setUI: (value: UI) => void
	canReOrderWidget: boolean
	toggleCanReOrderWidget: () => void
	ui: UI
}

const DEFAULT_SETTINGS: AppearanceData = {
	contentAlignment: 'top',
	fontFamily: 'Vazir',
	ui: 'ADVANCED',
}

export const AppearanceContext = createContext<AppearanceContextContextType | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<AppearanceData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)
	const [canReOrderWidget, setCanReOrderWidget] = useState(false)
	const { mutateAsync: changeFontAsync } = useChangeFont()
	const { mutateAsync: changeUIAsync } = useChangeUI()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		async function loadSettings() {
			const storedSettings = await getFromStorage('appearance')
			if (storedSettings) {
				setSettings({
					...DEFAULT_SETTINGS,
					...storedSettings,
				})
			}

			setIsInitialized(true)
		}

		const eventForFont = listenEvent('font_change', async (newFont) => {
			document.body.style.fontFamily = `"${newFont}", sans-serif`
			updateSetting('fontFamily', newFont)
		})

		const eventForUI = listenEvent('ui_change', async (newUI: any) => {
			updateSetting('ui', newUI)
		})

		loadSettings()

		return () => {
			eventForFont()
			eventForUI()
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.altKey &&
				event.key.toLowerCase() === 'y' &&
				(event.ctrlKey || event.metaKey)
			) {
				event.preventDefault()
				setUI(settings.ui === 'ADVANCED' ? 'SIMPLE' : 'ADVANCED')
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isAuthenticated, settings])

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

	const setFontFamily = async (value: string) => {
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

	const setUI = async (ui: UI) => {
		console.log('ui changed.', ui)
		if (!isAuthenticated)
			return showToast(
				'برای استفاده از این حالت، باید وارد حساب کاربری خود شوید!',
				'error'
			)

		const currentUI = settings.ui
		updateSetting('ui', ui)
		const [err] = await safeAwait(changeUIAsync({ ui }))
		if (err) {
			updateSetting('ui', currentUI)
			return showToast(translateError(err) as any, 'error')
		}
		Analytics.event(`set_ui_${ui}`)
	}

	const toggleCanReOrderWidget = async () => {
		setCanReOrderWidget(!canReOrderWidget)
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
		ui: settings.ui,
		setUI: setUI,
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
