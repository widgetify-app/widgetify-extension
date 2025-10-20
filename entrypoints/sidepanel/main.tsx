import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/index.css'
import '../../src/fonts.css'
import VerticalTabsApp from './VerticalTabsApp'

const rootElement = document.getElementById('root')
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<VerticalTabsApp />
		</React.StrictMode>
	)
}
