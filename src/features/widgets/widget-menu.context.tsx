import {
	createContext,
	type ReactNode,
	type RefObject,
	useContext,
	useLayoutEffect,
} from 'react'

interface WidgetMenuContextValue {
	isOpen: boolean
	toggleFromButton: (button: HTMLElement) => void
	actionsRef: RefObject<ReactNode>
	settingsSummaryRef: RefObject<string | null>
}

const WidgetMenuContext = createContext<WidgetMenuContextValue | null>(null)

interface WidgetMenuProviderProps {
	value: WidgetMenuContextValue
	children: ReactNode
}

export function WidgetMenuProvider({ value, children }: WidgetMenuProviderProps) {
	return (
		<WidgetMenuContext.Provider value={value}>{children}</WidgetMenuContext.Provider>
	)
}

export function useWidgetMenu() {
	return useContext(WidgetMenuContext)
}

export function useWidgetMenuActions(actions: ReactNode) {
	const menu = useWidgetMenu()

	useLayoutEffect(() => {
		if (!menu) return
		menu.actionsRef.current = actions
	})

	useLayoutEffect(() => {
		if (!menu) return
		return () => {
			menu.actionsRef.current = null
		}
	}, [menu])
}

export function useWidgetSettingsSummary(summary: string | null) {
	const menu = useWidgetMenu()

	useLayoutEffect(() => {
		if (!menu) return
		menu.settingsSummaryRef.current = summary
	})

	useLayoutEffect(() => {
		if (!menu) return
		return () => {
			menu.settingsSummaryRef.current = null
		}
	}, [menu])
}
