import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
	theme: string
	setTheme: (theme: string) => void
	themeUtils: {
		getCardBackground: () => string
		getBorderColor: () => string
		getButtonStyles: () => string
		getTextColor: () => string
		getInputStyles: () => string
		getHeadingTextStyle: () => string
		getDescriptionTextStyle: () => string
	}
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
		themeUtils: {
			getCardBackground: () => getCardBackground(theme),
			getBorderColor: () => getBorderColor(theme),
			getButtonStyles: () => getButtonStyles(theme),
			getTextColor: () => getTextColor(theme),
			getInputStyles: () => getInputStyles(theme),
			getHeadingTextStyle: () => getHeadingTextStyle(theme),
			getDescriptionTextStyle: () => getDescriptionTextStyle(theme),
		},
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

type ThemeType = 'light' | 'dark' | 'glass' | string

export const getCardBackground = (theme: ThemeType): string => {
	switch (theme) {
		case 'light':
			return 'bg-white text-gray-800'
		case 'dark':
			return 'bg-neutral-900 text-gray-300'
		default:
			return 'bg-neutral-900/70 backdrop-blur-sm text-gray-300'
	}
}

export const getBorderColor = (theme: ThemeType): string => {
	switch (theme) {
		case 'light':
			return 'border-gray-300/30'
		case 'dark':
			return 'border-gray-700/50'
		default:
			return 'border-gray-700/30'
	}
}

export const getButtonStyles = (theme: ThemeType, isPrimary = false): string => {
	const baseStyles = 'px-4 py-2 rounded-md transition-all duration-300'

	if (isPrimary) {
		return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white`
	}

	switch (theme) {
		case 'light':
			return `${baseStyles} bg-gray-200 hover:bg-gray-300 text-gray-800`
		case 'dark':
			return `${baseStyles} bg-gray-700 hover:bg-gray-600 text-gray-200`
		default:
			return `${baseStyles} bg-neutral-700/50 hover:bg-neutral-700 text-gray-200`
	}
}

export const getTextColor = (theme: ThemeType): string => {
	switch (theme) {
		case 'light':
			return 'text-gray-800'
		default:
			return 'text-gray-300'
	}
}

export const getInputStyles = (theme: ThemeType): string => {
	const baseStyles = 'px-3 py-2 rounded-md border focus:outline-none focus:ring-2'

	switch (theme) {
		case 'light':
			return `${baseStyles} bg-white border-gray-300 focus:ring-blue-500`
		case 'dark':
			return `${baseStyles} bg-gray-800 border-gray-700 text-white focus:ring-blue-600`
		default:
			return `${baseStyles} bg-black/30 border-gray-600 text-white backdrop-blur-sm focus:ring-blue-500`
	}
}

export const getHeadingTextStyle = (theme: ThemeType): string => {
	switch (theme) {
		case 'light':
			return 'text-gray-800'
		case 'dark':
			return 'text-gray-100'
		default:
			return 'text-gray-200'
	}
}

export const getDescriptionTextStyle = (theme: ThemeType): string => {
	let des = 'font-light '
	switch (theme) {
		case 'light':
			des += 'text-gray-600'
			break
		case 'dark':
			des += 'text-gray-300'
			break
		default:
			des += 'text-gray-400'
	}

	return des
}
