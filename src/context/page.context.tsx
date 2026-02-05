import { listenEvent } from '@/common/utils/call-event'
import type React from 'react'
import { createContext, useContext, useState } from 'react'

type Page = 'home' | 'explorer'
interface PageContextType {
	page: Page
	setPage: (page: Page) => void
}

export const PageContext = createContext<PageContextType | null>(null)
export function PageProvider({ children }: { children: React.ReactNode }) {
	const [page, setPage] = useState<Page>('home')

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
