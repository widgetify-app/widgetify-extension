import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import './fonts.css'
import './index.css'
import App from './app'

if (import.meta.env.DEV) {
	scan({
		enabled: true,
		log: true,
	})
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
