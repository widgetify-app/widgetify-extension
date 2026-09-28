import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import '@/styles/index.css'
import App from './app'

if (import.meta.env.DEV) {
	scan({
		enabled: false,
		log: true,
	})
}

const container = document.getElementById('root')
if (!container) throw new Error('newtab.html has no #root element')

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>
)
