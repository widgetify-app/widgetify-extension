import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/theme.context'
import { AuthProvider } from './context/auth.context'
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
					<HomePage />
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
