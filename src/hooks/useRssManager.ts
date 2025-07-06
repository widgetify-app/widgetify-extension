import { useState, useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { type NewsResponse, useGetNews } from '@/services/hooks/news/getNews.hook'
import type { RssItem, RssNewsState } from '@/layouts/widgets/news/news.interface'
import { fetchRssFeed } from '@/layouts/widgets/news/utils/rss.utils'

interface ExtendedNewsResponse extends NewsResponse {
	isCached?: boolean
}

export function useRssManager() {
	const [newsData, setNewsData] = useState<ExtendedNewsResponse>({
		news: [],
		platform: {
			name: '',
			url: '',
		},
		updatedAt: '',
	})

	const [rssState, setRssState] = useState<RssNewsState>({
		customFeeds: [],
		useDefaultNews: false,
		lastFetchedItems: {},
	})
	const [rssItems, setRssItems] = useState<RssItem[]>([])
	const [isLoadingRss, setIsLoadingRss] = useState(false)
	const [rssModalOpen, setRssModalOpen] = useState(false)

	const { data, isLoading, isError, dataUpdatedAt } = useGetNews(
		rssState.useDefaultNews
	)

	const fetchAllRssFeeds = async (
		feeds: typeof rssState.customFeeds,
		lastFetched: Record<string, RssItem[]> = {}
	) => {
		try {
			const newLastFetched = { ...lastFetched }
			let allItems: RssItem[] = []

			const feedPromises = feeds
				.filter((feed) => feed.enabled)
				.map(async (feed) => {
					try {
						const items = await fetchRssFeed(feed.url, feed.name)
						if (items.length > 0) newLastFetched[feed.id] = items
						return items
					} catch (error) {
						console.error(`Error fetching feed ${feed.name}:`, error)
						return lastFetched[feed.id] || []
					}
				})

			const allResults = await Promise.all(feedPromises)

			if (
				allResults.every((result) => result.length === 0) &&
				Object.values(lastFetched).flat().length > 0
			) {
				allItems = Object.values(lastFetched).flat() as RssItem[]
			} else {
				allItems = allResults.flat()
			}

			const twentyFourHoursAgo = new Date()
			twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

			allItems = allItems.filter((item) => {
				const itemDate = new Date(item.pubDate)
				return itemDate >= twentyFourHoursAgo
			})

			allItems.sort((a, b) => {
				const dateA = new Date(a.pubDate)
				const dateB = new Date(b.pubDate)
				return dateB.getTime() - dateA.getTime()
			})

			setRssItems(allItems)

			const newRssState: RssNewsState = {
				customFeeds: feeds,
				useDefaultNews: rssState.useDefaultNews,
				lastFetchedItems: newLastFetched,
			}
			setRssState(newRssState)

			setToStorage('rss_news_state', newRssState)
		} catch (error) {
			console.error('Error fetching RSS feeds:', error)
			const cachedItems = Object.values(lastFetched).flat() as RssItem[]
			if (cachedItems.length > 0) {
				setRssItems(cachedItems)
			}
		} finally {
			setIsLoadingRss(false)
		}
	}

	const getItemsToDisplay = () => {
		if (rssState.useDefaultNews) {
			return newsData.news
		}
		if (rssItems.length > 0) {
			return rssItems.map((item) => ({
				title: item.title,
				description: item.description,
				source: item.source,
				publishedAt: item.pubDate,
				link: item.link,
			}))
		}
		return []
	}

	const onCloseSettingModal = async (data: RssNewsState & { changed: boolean }) => {
		setRssModalOpen(false)

		if (!data.changed) {
			console.log('No changes made to RSS settings.')
			return
		}

		await setToStorage('rss_news_state', data)

		if (data.useDefaultNews) {
			const cachedNews = await getFromStorage('news')
			if (cachedNews) {
				setNewsData(cachedNews as ExtendedNewsResponse)
			}

			setRssState(structuredClone(data))
			return
		}

		const enabledFeeds = data.customFeeds.filter((feed) => feed.enabled)
		if (enabledFeeds.length > 0) {
			const hasCachedItems = Object.values(data.lastFetchedItems).some(
				(items) => items && items.length > 0
			)

			if (hasCachedItems) {
				const cachedItems = Object.values(
					data.lastFetchedItems
				).flat() as RssItem[]
				setRssItems(cachedItems)
			} else {
				setIsLoadingRss(true)
			}

			await fetchAllRssFeeds(enabledFeeds, data.lastFetchedItems)
		} else {
			setRssItems([])
		}
		setRssState(structuredClone(data))
	}

	const openRssModal = () => {
		setRssModalOpen(true)
	}

	// Load initial data
	useEffect(() => {
		const loadInitialData = async () => {
			const savedState = await getFromStorage('rss_news_state')
			if (savedState) {
				setRssState(savedState)

				if (savedState.useDefaultNews) {
					const cachedNews = await getFromStorage('news')
					if (cachedNews) {
						setNewsData(cachedNews as ExtendedNewsResponse)
					}
				} else {
					// Handle RSS feeds
					const enabledFeeds = savedState.customFeeds.filter(
						(feed) => feed.enabled
					)
					if (enabledFeeds.length > 0) {
						const hasCachedItems = Object.values(
							savedState.lastFetchedItems
						).some((items) => items && items.length > 0)

						if (hasCachedItems) {
							const cachedItems = Object.values(
								savedState.lastFetchedItems
							).flat() as RssItem[]
							setRssItems(cachedItems)
						} else {
							setIsLoadingRss(true)
						}

						await fetchAllRssFeeds(enabledFeeds, savedState.lastFetchedItems)
					}
				}
			}
		}

		loadInitialData()
	}, [])

	// Handle default news data updates
	useEffect(() => {
		if (rssState.useDefaultNews) {
			if (data.news?.length) {
				setNewsData({
					...data,
					isCached: false,
				})
				setToStorage('news', {
					...data,
					isCached: true,
				})
			} else if (isError) {
				getFromStorage('news').then((storedData) => {
					if (storedData) {
						setNewsData(storedData as ExtendedNewsResponse)
					}
				})
			}
		}
	}, [dataUpdatedAt, isError, rssState.useDefaultNews])

	return {
		rssState,
		rssItems,
		newsData,
		isLoadingRss,
		isLoading,
		isError,
		rssModalOpen,
		getItemsToDisplay,
		onCloseSettingModal,
		openRssModal,
	}
}
