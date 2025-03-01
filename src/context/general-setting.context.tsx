import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

interface GeneralSettingContextType {
	enablePets: boolean
	setEnablePets: (value: boolean) => void

	analyticsEnabled: boolean
	setAnalyticsEnabled: (value: boolean) => void
}

export interface GeneralData {
	analyticsEnabled: boolean
	enablePets: boolean
}

export const GeneralSettingContext = createContext<GeneralSettingContextType | null>(null)

export function GeneralSettingProvider({ children }: { children: React.ReactNode }) {
	const [enablePets, setEnablePetsState] = useState<boolean>(true)
	const [analyticsEnabled, setAnalyticsEnabledState] = useState<boolean>(true)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		async function loadGeneralSettings() {
			try {
				const general = await getFromStorage<GeneralData>(StoreKey.General_setting)

				if (general) {
					setEnablePetsState(general.enablePets ?? true)
					setAnalyticsEnabledState(general.analyticsEnabled ?? true)
				}
			} finally {
				setIsInitialized(true)
			}
		}

		loadGeneralSettings()
	}, [])

	const setEnablePets = useCallback(
		(value: boolean) => {
			setEnablePetsState(value)

			setToStorage(StoreKey.General_setting, {
				analyticsEnabled,
				enablePets: value,
			})
		},
		[analyticsEnabled],
	)

	const setAnalyticsEnabled = useCallback(
		(value: boolean) => {
			setAnalyticsEnabledState(value)

			setToStorage(StoreKey.General_setting, {
				analyticsEnabled: value,
				enablePets,
			})
		},
		[enablePets],
	)

	return (
		<GeneralSettingContext.Provider
			value={{
				enablePets,
				setEnablePets,
				analyticsEnabled,
				setAnalyticsEnabled,
			}}
		>
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
