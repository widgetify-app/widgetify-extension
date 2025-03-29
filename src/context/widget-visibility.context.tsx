import { getFromStorage, setToStorage } from '@/common/storage'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface WidgetVisibilityState {
	widgetify: boolean
	arzLive: boolean
	calendar: boolean
	weather: boolean
	news: boolean
}

interface WidgetVisibilityContextType {
	visibility: WidgetVisibilityState
	toggleWidget: (widgetId: keyof WidgetVisibilityState) => void
	openWidgetSettings: () => void
}

const defaultVisibility: WidgetVisibilityState = {
	widgetify: true,
	arzLive: true,
	calendar: true,
	weather: true,
	news: false,
}

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | undefined>(
	undefined,
)

export function WidgetVisibilityProvider({ children }: { children: ReactNode }) {
	const [visibility, setVisibility] = useState<WidgetVisibilityState>(defaultVisibility)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		async function loadSettings() {
			const storedVisibility = await getFromStorage('widgetVisibility')
			if (storedVisibility) {
				setVisibility(storedVisibility)
			}
			setIsLoaded(true)
		}

		loadSettings()
	}, [])

	useEffect(() => {
		if (isLoaded) {
			setToStorage('widgetVisibility', visibility)
		}
	}, [visibility, isLoaded])

	const toggleWidget = (widgetId: keyof WidgetVisibilityState) => {
		setVisibility((prev) => ({
			...prev,
			[widgetId]: !prev[widgetId],
		}))
	}

	const openWidgetSettings = () => {
		window.dispatchEvent(new Event('openWidgetSettings'))
	}

	return (
		<WidgetVisibilityContext.Provider
			value={{ visibility, toggleWidget, openWidgetSettings }}
		>
			{children}
		</WidgetVisibilityContext.Provider>
	)
}

export const useWidgetVisibility = () => {
	const context = useContext(WidgetVisibilityContext)
	if (context === undefined) {
		throw new Error('useWidgetVisibility must be used within a WidgetVisibilityProvider')
	}
	return context
}
