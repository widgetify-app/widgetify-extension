import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useUpdateExtensionSettings } from '@/services/hooks/extension/updateSetting.hook'
import {
	type FetchedTimezone,
	getTimezones,
} from '@/services/hooks/timezone/getTimezones.hook'
import { useAuth } from './auth.context'

export interface GeneralData {
	blurMode: boolean
	analyticsEnabled: boolean
	selected_timezone: FetchedTimezone
	browserBookmarksEnabled: boolean
	browserTabsEnabled: boolean
	browserHistoryEnabled: boolean
}

interface GeneralSettingContextType extends GeneralData {
	updateSetting: <K extends keyof GeneralData>(key: K, value: GeneralData[K]) => void
	setAnalyticsEnabled: (value: boolean) => void
	setTimezone: (value: FetchedTimezone) => void
	setBrowserBookmarksEnabled: (value: boolean) => void
	setBrowserTabsEnabled: (value: boolean, event?: React.MouseEvent) => void
	setBrowserHistoryEnabled: (value: boolean) => void
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
	browserTabsEnabled: false,
	browserHistoryEnabled: false,
}

export const GeneralSettingContext = createContext<GeneralSettingContextType | null>(null)

export function GeneralSettingProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<GeneralData>(DEFAULT_SETTINGS)
	const [isInitialized, setIsInitialized] = useState(false)
	const { isAuthenticated, user } = useAuth()
	const { mutateAsync } = useUpdateExtensionSettings()

	useEffect(() => {
		async function loadGeneralSettings() {
			try {
				const storedSettings = await getFromStorage('generalSettings')
				const [browserBookmarksEnabled, browserTabsEnabled] = await Promise.all([
					browserHasPermission(['bookmarks']),
					browserHasPermission(['tabs', 'tabGroups']),
				])

				if (storedSettings) {
					setSettings({
						...DEFAULT_SETTINGS,
						...storedSettings,
						selected_timezone:
							typeof storedSettings.selected_timezone === 'string'
								? DEFAULT_SETTINGS.selected_timezone
								: storedSettings.selected_timezone,
						browserBookmarksEnabled: browserBookmarksEnabled,
						browserTabsEnabled: browserTabsEnabled,
					})
				}
			} finally {
				setIsInitialized(true)
			}
		}

		loadGeneralSettings()
	}, [])

	useEffect(() => {
		async function getTimeZone() {
			if (user?.timeZone && user.timeZone !== settings?.selected_timezone?.value) {
				const timezones = await getTimezones()
				if (timezones?.length) {
					const matchingTimezone = timezones.find(
						(tz) => tz.value === user.timeZone
					)
					if (matchingTimezone) {
						updateSetting('selected_timezone', matchingTimezone)
					}
				}
			}
		}
		if (user) {
			getTimeZone()
		}
	}, [user])

	async function browserHasPermission(
		permissions: Browser.runtime.ManifestPermissions[]
	) {
		return browser.permissions.contains({ permissions })
	}

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
	const setTimezone = async (value: FetchedTimezone) => {
		updateSetting('selected_timezone', value)
		if (isAuthenticated) {
			await mutateAsync({ timeZone: value.value })
		}
	}

	//#region [⚠️ Important note:]
	// In Firefox, browser.permissions.request can only be called directly
	// from a user input handler (like a click event).
	// Using async/await breaks this direct connection and Firefox throws an error.
	// Therefore, these functions are written entirely without async/await
	// and use Promise chaining instead.
	//#endregion
	const togglePermission =
		(
			permissions: Browser.runtime.ManifestPermissions[],
			settingKey: keyof GeneralData,
			enableEvent: string,
			disableEvent: string
		) =>
		(value: boolean) => {
			if (import.meta.env.FIREFOX) {
				if (value) {
					browser.permissions
						.request({ permissions })
						.then((granted) => {
							if (granted) {
								updateSetting(settingKey, true)
								Analytics.event(enableEvent)
							}
						})
						.catch(console.error)
				} else {
					browser.permissions
						.remove({ permissions })
						.then(() => {
							updateSetting(settingKey, false)
							Analytics.event(disableEvent)
						})
						.catch(console.error)
				}
			} else {
				browser.permissions.contains({ permissions }).then((hasPermission) => {
					if (value) {
						browser.permissions
							.request({ permissions })
							.then((granted) => {
								if (granted) {
									updateSetting(settingKey, true)
									Analytics.event(enableEvent)
								} else {
									console.log('Permission denied')
								}
							})
							.catch(console.error)
					} else {
						if (!hasPermission) {
							updateSetting(settingKey, false)
							return
						}

						Analytics.event(disableEvent)

						browser.permissions
							.remove({ permissions })
							.then(() => {
								updateSetting(settingKey, false)
							})
							.catch(() => {
								updateSetting(settingKey, false)
							})
					}
				})
			}
		}

	const setBrowserBookmarksEnabled = togglePermission(
		['bookmarks'],
		'browserBookmarksEnabled',
		'browser_bookmarks_enabled',
		'browser_bookmarks_disabled'
	)

	const setBrowserTabsEnabled = togglePermission(
		['tabs', 'tabGroups'],
		'browserTabsEnabled',
		'browser_tabs_enabled',
		'browser_tabs_disabled'
	)

	const setBrowserHistoryEnabled = togglePermission(
		['history'],
		'browserHistoryEnabled',
		'browser_history_enabled',
		'browser_history_disabled'
	)

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
		browserTabsEnabled: settings.browserTabsEnabled,
		setBrowserTabsEnabled,
		browserHistoryEnabled: settings.browserHistoryEnabled,
		setBrowserHistoryEnabled,
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
