import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GeneralSettingProvider } from './context/general-setting.context'
import { ThemeProvider } from './context/theme.context'
import { HomePage } from './pages/home'
const queryClient = new QueryClient()

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
