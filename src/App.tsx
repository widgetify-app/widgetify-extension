import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import { AppearanceProvider } from './context/appearance.context'
import { AuthProvider } from './context/auth.context'
import { ThemeProvider } from './context/theme.context'
import { HomePage } from './pages/home'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

export const AnimationContext = createContext({ skipAnimations: false })

function App() {
	const [skipAnimations, setSkipAnimations] = useState(false)

	useEffect(() => {
		const checkTabs = async () => {
			try {
				const tabs = await Browser.tabs.query({})
				if (tabs.length > 1) {
					setSkipAnimations(true)
				}
			} catch (error) {
				console.error('Error checking tabs:', error)
			}
		}

		checkTabs()
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>
					<AppearanceProvider>
						<AnimationContext.Provider value={{ skipAnimations }}>
							<HomePage />
						</AnimationContext.Provider>
					</AppearanceProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
