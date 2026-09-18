import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './app'

function loadRemoteFontsAsync() {
	if (typeof document === 'undefined') return
	const id = 'widgetify-remote-fonts'
	if (document.getElementById(id)) return

	const link = document.createElement('link')
	link.id = id
	link.rel = 'stylesheet'
	link.href = 'https://cdn.widgetify.ir/fonts/remote-fonts.css'
	document.head.appendChild(link)
}

loadRemoteFontsAsync()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
