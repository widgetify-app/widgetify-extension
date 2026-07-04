import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type IconPackName = 'default' //| 'pack_name'

interface IconContextValue {
	pack: IconPackName
	setPack: (pack: IconPackName) => void
}

const IconContext = createContext<IconContextValue | null>(null)

interface IconProviderProps {
	children: ReactNode
	defaultTheme?: IconPackName
}

export function IconProvider({ children, defaultTheme = 'default' }: IconProviderProps) {
	const [pack, setPack] = useState<IconPackName>(defaultTheme)

	const value = useMemo(
		() => ({
			pack,
			setPack,
		}),
		[pack]
	)

	return <IconContext.Provider value={value}>{children}</IconContext.Provider>
}

export function useIconPack() {
	const context = useContext(IconContext)

	if (!context) {
		throw new Error('useIconPack must be used inside IconProvider')
	}

	return context
}
