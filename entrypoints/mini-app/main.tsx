import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/styles/index.css'
import { AppearanceProvider } from '@/context/appearance.context'
import { AuthProvider } from '@/context/auth.context'
import { ThemeProvider } from '@/context/theme.context'
import { MiniAppPopup } from '@/features/mini-apps/components/mini-app-popup'

const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

const container = document.getElementById('root')
if (!container) throw new Error('mini-app.html has no #root element')

createRoot(container).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>
					<AppearanceProvider>
						<MiniAppPopup />
					</AppearanceProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
)
