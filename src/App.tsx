import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VerticalTabsProvider } from '../entrypoints/sidepanel/context/vertical-tabs.context'
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

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>
					<AppearanceProvider>
						<VerticalTabsProvider>
							<HomePage />
						</VerticalTabsProvider>
					</AppearanceProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
