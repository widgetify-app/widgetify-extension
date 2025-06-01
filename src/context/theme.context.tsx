import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
	theme: string
	setTheme: (theme: string) => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<string>(
		() => localStorage.getItem('widgetify-theme') || 'light',
	)

	async function loadTheme() {
		const theme = await getFromStorage('theme')
		return theme
	}

	useEffect(() => {
		loadTheme().then((theme) => {
			if (theme) {
				setTheme(theme)
				document.documentElement.setAttribute('data-theme', theme)
			}
		})
	}, [])

	const setThemeCallback = (theme: string) => {
		const oldTheme = document.documentElement?.getAttribute('data-theme') || 'light'
		setTheme(theme)
		setToStorage('theme', theme as any)
		document.documentElement.setAttribute('data-theme', theme)

		Analytics.featureUsed(
			'theme_change',
			{
				previous_theme: oldTheme,
				new_theme: theme,
			},
			'click',
		)
	}

	const contextValue: ThemeContextType = {
		theme,
		setTheme: setThemeCallback,
	}

	return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const context = useContext(ThemeContext)

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}
