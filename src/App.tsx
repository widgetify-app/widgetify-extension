import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './pages/home'
import { PageWrapper } from './pages/wrapper'
const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<PageWrapper>
				<HomePage />
			</PageWrapper>
		</QueryClientProvider>
	)
}

export default App
