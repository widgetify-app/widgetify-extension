import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

interface GeneralSettingContextType {
	enablePets: boolean
	setEnablePets: (value: boolean) => void

	analyticsEnabled: boolean
	setAnalyticsEnabled: (value: boolean) => void

	contentAlignment: 'center' | 'top'
	setContentAlignment: (value: 'center' | 'top') => void
}

export interface GeneralData {
	analyticsEnabled: boolean
	enablePets: boolean
	contentAlignment: 'center' | 'top'
}

export const GeneralSettingContext = createContext<GeneralSettingContextType | null>(null)

export function GeneralSettingProvider({ children }: { children: React.ReactNode }) {
	const [enablePets, setEnablePetsState] = useState<boolean>(true)
	const [analyticsEnabled, setAnalyticsEnabledState] = useState<boolean>(true)
	const [contentAlignment, setContentAlignmentState] = useState<'center' | 'top'>(
		'center',
	)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		async function loadGeneralSettings() {
			try {
				const general = await getFromStorage<GeneralData>(StoreKey.General_setting)

				if (general) {
					setEnablePetsState(general.enablePets ?? true)
					setAnalyticsEnabledState(general.analyticsEnabled ?? true)
					setContentAlignmentState(general.contentAlignment ?? 'center')
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
				contentAlignment,
			})
		},
		[analyticsEnabled, contentAlignment],
	)

	const setAnalyticsEnabled = useCallback(
		(value: boolean) => {
			setAnalyticsEnabledState(value)

			setToStorage(StoreKey.General_setting, {
				analyticsEnabled: value,
				enablePets,
				contentAlignment,
			})
		},
		[enablePets, contentAlignment],
	)

	const setContentAlignment = useCallback(
		(value: 'center' | 'top') => {
			setContentAlignmentState(value)

			setToStorage(StoreKey.General_setting, {
				analyticsEnabled,
				enablePets,
				contentAlignment: value,
			})
		},
		[analyticsEnabled, enablePets],
	)

	if (!isInitialized) {
		return null
	}

	return (
		<GeneralSettingContext.Provider
			value={{
				enablePets,
				setEnablePets,
				analyticsEnabled,
				setAnalyticsEnabled,
				contentAlignment,
				setContentAlignment,
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
