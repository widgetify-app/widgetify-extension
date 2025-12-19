import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useChangeTheme } from '@/services/hooks/extension/updateSetting.hook'
import { useAuth } from './auth.context'

interface ThemeContextType {
	theme: string
	setTheme: (theme: string) => void
}

export enum Theme {
	Light = 'light',
	Dark = 'dark',
	Glass = 'glass',
	Icy = 'icy',
	Zarna = 'zarna',
	esteghlal = 'esteghlal',
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<string>('')
	const { isAuthenticated } = useAuth()
	const { mutateAsync } = useChangeTheme()
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
				setTheme(Theme.Dark)
				document.documentElement.setAttribute('data-theme', Theme.Dark)
			}
		})

		const event = listenEvent('theme_change', (newTheme: Theme) => {
			applyThemeChange(newTheme)
		})

		const eventForTitle = listenEvent('browser_title_change', (newTitle) => {
			document.title = newTitle.template
			setToStorage('browserTitle', newTitle)
		})

		return () => {
			event()
			eventForTitle()
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
				const freeThemes = [
					Theme.Light,
					Theme.Dark,
					Theme.Glass,
					Theme.Icy,
					Theme.Zarna,
				]
				const currentIndex = freeThemes.indexOf(theme as Theme)
				const nextIndex = (currentIndex + 1) % freeThemes.length
				const nextTheme = freeThemes[nextIndex]
				setThemeCallback(nextTheme)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [theme])

	const setThemeCallback = async (theme: string) => {
		applyThemeChange(theme)
		if (isAuthenticated) {
			await mutateAsync({ theme: theme })
		}
	}

	const applyThemeChange = (theme: string) => {
		document.documentElement.setAttribute('data-theme', theme)
		setTheme(theme)
		setToStorage('theme', theme as any)
		Analytics.event('theme_change')
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
