import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
			<ThemeProvider>
				<HomePage />
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
