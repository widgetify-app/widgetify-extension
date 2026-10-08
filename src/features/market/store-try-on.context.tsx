import { createContext, type ReactNode, useContext, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { TryOnBar } from './components/store-item/try-on-bar'
import { useTryOnPreview } from './hooks/use-try-on-preview'
import type { StoreItem } from './types'

interface StoreTryOnValue {
	tryOn: (item: StoreItem) => void
	isTryingOn: boolean
}

const StoreTryOnContext = createContext<StoreTryOnValue | null>(null)

interface StoreTryOnProviderProps {
	onStepAside: (aside: boolean) => void
	onClose: () => void
	children: ReactNode
}

export function StoreTryOnProvider({
	onStepAside,
	onClose,
	children,
}: StoreTryOnProviderProps) {
	const [item, setItem] = useState<StoreItem | null>(null)
	const { start, restore } = useTryOnPreview()
	const returnFocusTo = useRef<HTMLElement | null>(null)

	const tryOn = async (next: StoreItem) => {
		Analytics.event('market_item_try_on')
		const started = await start(next)
		if (!started) return
		returnFocusTo.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null
		setItem(next)
		onStepAside(true)
	}

	const keep = () => {
		setItem(null)
		onStepAside(false)
		onClose()
	}

	const goBack = () => {
		if (item) restore(item)
		setItem(null)
		onStepAside(false)
		requestAnimationFrame(() => returnFocusTo.current?.focus())
	}

	return (
		<StoreTryOnContext.Provider value={{ tryOn, isTryingOn: item !== null }}>
			{children}
			{item && <TryOnBar item={item} onKept={keep} onBack={goBack} />}
		</StoreTryOnContext.Provider>
	)
}

export function useStoreTryOn() {
	const context = useContext(StoreTryOnContext)
	if (!context) {
		throw new Error('useStoreTryOn must be used within a StoreTryOnProvider')
	}
	return context
}
