import { listenEvent } from '@/common/utils/call-event'
import type React from 'react'
import { createContext, useContext, useState } from 'react'

export enum Page {
	Home = 'home',
	Explorer = 'explorer',
	MiniApps = 'mini-apps',
}
interface PageContextType {
	page: Page
	setPage: (page: Page) => void
}

export const PageContext = createContext<PageContextType | null>(null)
export function PageProvider({ children }: { children: React.ReactNode }) {
	const [page, setPage] = useState<Page>(Page.Home)

	useEffect(() => {
		const event = listenEvent('go_to_page', (p) => {
			setPage(p)
		})
		return () => {
			event()
		}
	}, [])

	return (
		<PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>
	)
}

export function usePage() {
	const context = useContext(PageContext)

	if (!context) {
		throw new Error('usePage must be used within a PageProvider')
	}

	return context
}
