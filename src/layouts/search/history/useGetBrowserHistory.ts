import { useState, useEffect } from 'react'

export const useGetBrowserHistory = (enabled: boolean) => {
	const [data, setData] = useState<any[]>([])

	useEffect(() => {
		if (!enabled) {
			setData([])
			return
		}

		async function fetchHistory() {
			if (typeof browser !== 'undefined' && browser.history) {
				let historyItems = await browser.history.search({
					text: '',
					maxResults: 50,
					startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
				})

				const items = historyItems
					.filter((item) => {
						const hasTitle = item.title && item.title.trim() !== ''
						const isNotUrlOnly = item.title !== item.url
						const isNotSystemPage = item.url && !item.url.includes('newtab')

						return hasTitle && isNotUrlOnly && isNotSystemPage
					})
					.slice(0, 8)
					.map((item) => ({
						id: item.id,
						title: item.title,
						url: item.url,
						lastVisitTime: item.lastVisitTime || 0,
					}))

				setData(items)
			}
		}

		fetchHistory()
	}, [enabled])

	return data
}
