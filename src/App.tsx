import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppearanceProvider } from './context/appearance.context'
import { AuthProvider } from './context/auth.context'
import { ThemeProvider } from './context/theme.context'
import { HomePage } from './pages/home'
import { PageProvider } from './context/page.context'

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
							<HomePage />
						</PageProvider>
					</AppearanceProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
