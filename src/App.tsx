import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppearanceProvider } from './context/appearance.context'
import { AuthProvider } from './context/auth.context'
import { ThemeProvider } from './context/theme.context'
import { PageProvider } from './context/page.context'
import { RootLayout } from './pages/root'

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
						<PageProvider>
							<RootLayout />
						</PageProvider>
					</AppearanceProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
