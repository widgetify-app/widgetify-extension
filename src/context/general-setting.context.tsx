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
	selectedCity: SelectedCity
}

export interface SelectedCity {
	name: string
	lat: number
	lon: number
	state?: string | null
}

interface GeneralSettingContextType extends GeneralData {
	updateSetting: <K extends keyof GeneralData>(key: K, value: GeneralData[K]) => void
	setAnalyticsEnabled: (value: boolean) => void
	setTimezone: (value: FetchedTimezone) => void
	setSelectedCity: (value: any) => void
	setBrowserBookmarksEnabled: (value: boolean) => void
	setBrowserTabsEnabled: (value: boolean, event?: React.MouseEvent) => void
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
	selectedCity: { name: 'Tehran', lat: 35.6892523, lon: 51.3896004, state: null },
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
				const [browserBookmarksEnabled, browserTabsEnabled, selectedCity] =
					await Promise.all([
						browserHasPermission(['bookmarks']),
						browserHasPermission(['tabs', 'tabGroups']),
						getFromStorage('selectedCity'),
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
						selectedCity: {
							lat: selectedCity?.lat || DEFAULT_SETTINGS.selectedCity.lat,
							lon: selectedCity?.lon || DEFAULT_SETTINGS.selectedCity.lon,
							name:
								selectedCity?.name || DEFAULT_SETTINGS.selectedCity.name,
							state:
								selectedCity?.state ||
								DEFAULT_SETTINGS.selectedCity.state,
						},
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

	const setBrowserBookmarksEnabled = async (value: boolean) => {
		const permissions: Browser.runtime.ManifestPermissions[] = ['bookmarks']
		if (import.meta.env.FIREFOX) {
			if (value) {
				browser.permissions
					.request({ permissions })
					.then((granted) => {
						if (granted) {
							updateSetting('browserBookmarksEnabled', true)
							Analytics.event('browser_bookmarks_enabled')
						}
					})
					.catch(console.error)
			} else {
				browser.permissions
					.remove({ permissions })
					.then(() => {
						updateSetting('browserBookmarksEnabled', false)
						Analytics.event('browser_bookmarks_disabled')
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
								updateSetting('browserBookmarksEnabled', true)
								Analytics.event('browser_bookmarks_enabled')
							} else {
								console.log('Permission denied')
							}
						})
						.catch(console.error)
				} else {
					if (!hasPermission) {
						updateSetting('browserBookmarksEnabled', false)
						return
					}

					Analytics.event('browser_bookmarks_disabled')

					browser.permissions
						.remove({ permissions })
						.then(() => {
							updateSetting('browserBookmarksEnabled', false)
						})
						.catch(() => {
							updateSetting('browserBookmarksEnabled', false)
						})
				}
			})
		}
	}

	//#region [⚠️ Important note:]
	// In Firefox, browser.permissions.request can only be called directly
	// from a user input handler (like a click event).
	// Using async/await breaks this direct connection and Firefox throws an error.
	// Therefore, this function is written entirely without async/await
	// and uses Promise chaining instead.
	//#endregion
	const setBrowserTabsEnabled = (value: boolean) => {
		const permissions: Browser.runtime.ManifestPermissions[] = ['tabs', 'tabGroups']
		if (import.meta.env.FIREFOX) {
			if (value) {
				browser.permissions
					.request({ permissions })
					.then((granted) => {
						if (granted) {
							updateSetting('browserTabsEnabled', true)
							Analytics.event('browser_tabs_enabled')
						}
					})
					.catch(console.error)
			} else {
				browser.permissions
					.remove({ permissions })
					.then(() => {
						updateSetting('browserTabsEnabled', false)
						Analytics.event('browser_tabs_disabled')
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
								updateSetting('browserTabsEnabled', true)
								Analytics.event('browser_tabs_enabled')
							} else {
								console.log('Permission denied')
							}
						})
						.catch(console.error)
				} else {
					if (!hasPermission) {
						updateSetting('browserTabsEnabled', false)
						return
					}

					Analytics.event('browser_tabs_disabled')

					browser.permissions
						.remove({ permissions })
						.then(() => {
							updateSetting('browserTabsEnabled', false)
						})
						.catch(() => {
							updateSetting('browserTabsEnabled', false)
						})
				}
			})
		}
	}

	const setSelectedCity = (val: SelectedCity) => {
		updateSetting('selectedCity', val)
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
		browserTabsEnabled: settings.browserTabsEnabled,
		setBrowserTabsEnabled,
		selectedCity: settings.selectedCity,
		setSelectedCity,
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
