import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '../common/storage'

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
		() => localStorage.getItem('widgetify-theme') || 'glass',
	)

	async function loadTheme() {
		const theme = await getFromStorage('theme')
		return theme
	}

	useEffect(() => {
		loadTheme().then((theme) => {
			if (theme) {
				setTheme(theme)
				document.body.setAttribute('data-theme', theme)
				document.body.className = `theme-${theme}`
			}
		})
	}, [])

	const setThemeCallback = useCallback(
		(theme: string) => {
			setTheme(theme)
			setToStorage('theme', theme as any)
		},
		[theme],
	)

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
			return `${baseStyles} bg-gray-800/50 hover:bg-gray-700/60 text-gray-200 backdrop-blur-sm`
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
	switch (theme) {
		case 'light':
			return 'text-gray-600'
		case 'dark':
			return 'text-gray-300'
		default:
			return 'text-gray-400'
	}
}
