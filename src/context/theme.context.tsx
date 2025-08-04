import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { setUserThemeApi } from '@/services/hooks/user/userService.hook'
import { useAuth } from './auth.context'

interface ThemeContextType {
	theme: string
	setTheme: (theme: string) => void
}

export enum Theme {
	Light = 'light',
	Dark = 'dark',
	Glass = 'glass',
	Zarna = 'zarna',
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<string>('')
	const { isAuthenticated } = useAuth()
	async function loadTheme() {
		const theme = await getFromStorage('theme')
		return theme
	}

	useEffect(() => {
		loadTheme().then((theme) => {
			if (theme) {
				setTheme(theme)
				document.documentElement.setAttribute('data-theme', theme)
			} else {
				setTheme(Theme.Light)
				document.documentElement.setAttribute('data-theme', Theme.Light)
			}
		})

		const event = listenEvent('themeChanged', (newTheme: Theme) => {
			applyThemeChange(newTheme)
		})

		return () => {
			event()
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.altKey &&
				event.key.toLowerCase() === 't' &&
				(event.ctrlKey || event.metaKey)
			) {
				event.preventDefault()
				const themes = Object.values(Theme)
				const currentIndex = themes.indexOf(theme as Theme)
				const nextIndex = (currentIndex + 1) % themes.length
				const nextTheme = themes[nextIndex]
				setThemeCallback(nextTheme)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [theme])

	const setThemeCallback = async (theme: string) => {
		applyThemeChange(theme)
		if (!isAuthenticated) return
		await setUserThemeApi(theme as any)
	}

	const applyThemeChange = (theme: string) => {
		setTheme(theme)
		setToStorage('theme', theme as any)
		document.documentElement.setAttribute('data-theme', theme)
		const oldTheme = document.documentElement?.getAttribute('data-theme') || 'light'
		Analytics.featureUsed(
			'theme_change',
			{
				previous_theme: oldTheme,
				new_theme: theme,
			},
			'click'
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
