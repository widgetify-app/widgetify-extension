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
const freeThemes = [Theme.Light, Theme.Dark, Theme.Glass, Theme.Icy, Theme.Zarna]

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
				applyThemeToDom(theme)
			} else {
				setTheme(Theme.Light)
				applyThemeToDom(Theme.Light)
			}
		})

		const event = listenEvent('theme_change', (newTheme: Theme) => {
			themeChangeHandler(newTheme)
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
		themeChangeHandler(theme)
		if (isAuthenticated) {
			await mutateAsync({ theme: theme })
		}
	}

	const themeChangeHandler = (theme: any) => {
		if (!Object.values(Theme).includes(theme)) {
			loadRemoteTheme(theme)
		} else {
			applyThemeToDom(theme)
		}

		setTheme(theme)
		setToStorage('theme', theme as any)
		Analytics.event('theme_change')
	}

	const applyThemeToDom = (theme: any) => {
		document.documentElement.setAttribute('data-theme', theme)
		if (!Object.values(Theme).includes(theme)) loadRemoteTheme(theme)
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

export async function loadRemoteTheme(themeName: string) {
	const url = `https://cdn.widgetify.ir/themes/${themeName}.css`

	const css = await fetch(url).then((r) => r.text())

	let style = document.getElementById('remote-theme')

	if (!style) {
		style = document.createElement('style')
		style.id = 'remote-theme'
		document.head.appendChild(style)
	}

	style.innerHTML = css

	document.documentElement.setAttribute('data-theme', themeName)
}
