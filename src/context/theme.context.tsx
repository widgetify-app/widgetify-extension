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
    const oldTheme =
      document.documentElement?.getAttribute('data-theme') || 'light'
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

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

type ThemeType = 'light' | 'dark' | 'glass' | string

const getContainerBackground = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'bg-white text-gray-800'
    case 'dark':
      return 'bg-neutral-900 text-gray-300'
    default:
      return 'bg-neutral-900/70 text-gray-300  backdrop-blur-sm'
  }
}

const getCardBackground = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'bg-white text-gray-800'
    case 'dark':
      return 'bg-neutral-800 text-gray-300'
    default:
      return 'bg-neutral-900/70 text-gray-300 backdrop-blur-sm'
  }
}

const getWidgetItemBackground = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'bg-gray-100/70'
    case 'dark':
      return 'bg-neutral-800/20'
    default: // glass
      return 'bg-neutral-900/40'
  }
}

const getBorderColor = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'border-gray-300/50'
    case 'dark':
      return 'border-gray-700/50'
    default:
      return 'border-gray-700/30'
  }
}

const getButtonStyles = (
  theme: ThemeType,
  isPrimary = false,
  rounded = true,
): string => {
  let baseStyles = 'px-4 py-2 transition-all duration-300 '
  if (rounded) {
    baseStyles += 'rounded-md '
  }
  if (isPrimary) {
    return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white`
  }

  switch (theme) {
    case 'light':
      return `${baseStyles} bg-gray-200 hover:bg-gray-300 text-gray-800`
    case 'dark':
      return `${baseStyles} bg-neutral-800/50 hover:bg-neutral-600 text-gray-200`
    default:
      return `${baseStyles} bg-neutral-700/50 hover:bg-neutral-700 text-gray-200`
  }
}

const getTextColor = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'text-gray-800'
    default:
      return 'text-gray-300'
  }
}

const getInputStyles = (theme: ThemeType): string => {
  const baseStyles =
    'px-3 py-2 rounded-md border focus:outline-none focus:ring-2'

  switch (theme) {
    case 'light':
      return `${baseStyles} bg-white border-gray-300 focus:ring-blue-500`
    case 'dark':
      return `${baseStyles} bg-gray-800 border-gray-700 text-white focus:ring-blue-600`
    default:
      return `${baseStyles} bg-black/30 border-gray-600 text-white backdrop-blur-sm focus:ring-blue-500`
  }
}

const getHeadingTextStyle = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'text-gray-800'
    case 'dark':
      return 'text-gray-100'
    default:
      return 'text-gray-200'
  }
}

const getDescriptionTextStyle = (theme: ThemeType): string => {
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

const getTooltipStyle = (theme: ThemeType): string => {
  switch (theme) {
    case 'light':
      return 'bg-white text-gray-800 border border-gray-200 shadow-lg'
    case 'dark':
      return 'bg-neutral-800 text-gray-100 border border-neutral-700 shadow-lg'
    default:
      return 'bg-black/70 backdrop-blur-md text-white border border-gray-700/30 shadow-lg'
  }
}

const getBookmarkStyle = (theme: string) => {
  switch (theme) {
    case 'light':
      return 'hover:bg-gray-100/95 border-gray-300/30 hover:border-gray-400/50 text-gray-800'
    case 'dark':
      return 'hover:bg-neutral-700/95 border-gray-700/50 hover:border-gray-600/70 text-gray-200'
    default: // glass
      return 'backdrop-blur-sm hover:bg-neutral-800/80 border-white/10 hover:border-white/20 text-gray-300'
  }
}

const getProgressBarBgStyle = (theme: string) => {
  switch (theme) {
    case 'light':
      return 'bg-gray-300'

    default:
      return 'bg-gray-700'
  }
}

export const getInputStyle = (theme: string) => {
  switch (theme) {
    case 'light':
      return `
                    bg-gray-100/70 text-gray-800 border-gray-300/30 transition-all duration-300
                    placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:gray-100 disabled:bg-gray-100 disabled:text-gray-500
                `
    case 'dark':
      return `
                    bg-neutral-800/80 text-gray-200 border-gray-700/40
                    placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:bg-neutral-800/90 disabled:bg-gray-800/50 disabled:text-gray-500
                `
    default: // glass
      return `
                    bg-white/5 text-gray-200 border-white/10
                    placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    hover:bg-white/10 disabled:bg-white/3 disabled:text-gray-500
                `
  }
}

export {
  getContainerBackground,
  getCardBackground,
  getWidgetItemBackground,
  getBorderColor,
  getButtonStyles,
  getTextColor,
  getInputStyles,
  getHeadingTextStyle,
  getDescriptionTextStyle,
  getTooltipStyle,
  getBookmarkStyle,
  getProgressBarBgStyle,
}
