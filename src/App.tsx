import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppearanceProvider } from './context/appearance.context'
import { AuthProvider } from './context/auth.context'
import { GeneralSettingProvider } from './context/general-setting.context'
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
				<GeneralSettingProvider>
					<ThemeProvider>
						<AppearanceProvider>
							<HomePage />
						</AppearanceProvider>
					</ThemeProvider>
				</GeneralSettingProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
