import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { type NewsResponse, useGetNews } from '@/services/hooks/news/getNews.hook'
import { WidgetContainer } from '../widget-container'
import { NewsContainer } from './components/news-container'
import { type FilterSortState, NewsFilterSort } from './components/news-filter-sort'
import { NewsHeader } from './components/news-header'
import { NewsItem } from './components/news-item'
import type { RssItem, WigiNewsSetting } from './news.interface'
import { fetchRssFeed } from './utils/rss.utils'

interface ExtendedNewsResponse extends NewsResponse {
	isCached?: boolean
}

interface NewsLayoutProps {
	inComboWidget: boolean
	enableBackground?: boolean
}

export const NewsLayout: React.FC<NewsLayoutProps> = ({
	enableBackground = true,
	inComboWidget,
}) => {
	const [newsData, setNewsData] = useState<ExtendedNewsResponse>({
		news: [],
		platform: {
			name: '',
			url: '',
		},
		updatedAt: '',
	})

	const [rssState, setRssState] = useState<WigiNewsSetting>({
		customFeeds: [],
		useDefaultNews: false,
		lastFetchedItems: {},
	})
	const [rssItems, setRssItems] = useState<RssItem[]>([])
	const [isLoadingRss, setIsLoadingRss] = useState(false)
	const [filterSortState, setFilterSortState] = useState<FilterSortState>({
		sortBy: 'random',
		filterBySource: 'all',
	})

	useEffect(() => {
		const loadFilterPreferences = async () => {
			const savedFilter = await getFromStorage('news_filter_sort_state')
			if (savedFilter) {
				setFilterSortState(savedFilter)
			}
		}
		loadFilterPreferences()
	}, [])

	useEffect(() => {
		setToStorage('news_filter_sort_state', filterSortState)
	}, [filterSortState])

	const { data, isLoading, isError, dataUpdatedAt } = useGetNews(
		rssState.useDefaultNews
	)

	const openNewsLink = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

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

			const newRssState: WigiNewsSetting = {
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

	const getFilteredAndSortedItems = () => {
		let items = getItemsToDisplay()

		if (filterSortState.filterBySource !== 'all') {
			items = items.filter((item) => {
				const sourceName =
					typeof item.source === 'string'
						? item.source
						: item.source?.name || ''
				return sourceName === filterSortState.filterBySource
			})
		}

		items.sort((a, b) => {
			switch (filterSortState.sortBy) {
				case 'source': {
					const sourceA =
						typeof a.source === 'string' ? a.source : a.source?.name || ''
					const sourceB =
						typeof b.source === 'string' ? b.source : b.source?.name || ''
					return sourceA.localeCompare(sourceB, 'fa')
				}
				case 'title':
					return (a.title || '').localeCompare(b.title || '', 'fa')
				default:
					return 0
			}
		})

		return items
	}

	const getAvailableSources = () => {
		const items = getItemsToDisplay()
		const sources = new Set<string>()

		for (const item of items) {
			const sourceName =
				typeof item.source === 'string' ? item.source : item.source?.name || ''
			if (sourceName) {
				sources.add(sourceName)
			}
		}

		return Array.from(sources).sort((a, b) => a.localeCompare(b, 'fa'))
	}

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

		const event = listenEvent(
			'wigiNewsSettingsChanged',
			async (data: WigiNewsSetting) => {
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
		)

		loadInitialData()
		return () => {
			event()
		}
	}, [])

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
	}, [dataUpdatedAt, isError])
	const displayItems = getFilteredAndSortedItems()
	const availableSources = getAvailableSources()
	const isAnyLoading = isLoading || isLoadingRss
	const noItemsToShow = !isAnyLoading && displayItems.length === 0
	return (
		<>
			{inComboWidget ? (
				<div className="flex flex-col gap-2">
					<NewsFilterSort
						availableSources={availableSources}
						currentState={filterSortState}
						onStateChange={setFilterSortState}
					/>
					<NewsContainer
						inComboWidget={inComboWidget}
						isLoading={isAnyLoading}
						isEmpty={noItemsToShow}
						noFeedsConfigured={
							!rssState.useDefaultNews && rssState.customFeeds.length === 0
						}
					>
						{' '}
						{displayItems.map((item, index) => (
							<NewsItem
								key={index}
								title={item.title}
								description={item.description}
								source={item.source}
								publishedAt={item.publishedAt}
								link={'link' in item ? (item.link as string) : undefined}
								index={index}
								onClick={openNewsLink}
							/>
						))}
					</NewsContainer>
				</div>
			) : (
				<WidgetContainer
					background={enableBackground}
					className={'flex flex-col gap-1 px-2 py-2 overflow-y-auto'}
					style={{
						scrollbarWidth: 'none',
					}}
				>
					<NewsHeader
						title="ویجی نیوز"
						useDefaultNews={rssState.useDefaultNews}
						platformName={newsData.platform.name}
						platformUrl={newsData.platform.url}
						onSettingsClick={() =>
							callEvent('openWidgetsSettings', {
								tab: WidgetTabKeys.news_settings,
							})
						}
					/>

					<NewsFilterSort
						availableSources={availableSources}
						currentState={filterSortState}
						onStateChange={setFilterSortState}
					/>

					<NewsContainer
						inComboWidget={inComboWidget}
						isLoading={isAnyLoading}
						isEmpty={noItemsToShow}
						noFeedsConfigured={
							!rssState.useDefaultNews && rssState.customFeeds.length === 0
						}
					>
						{displayItems.map((item, index) => (
							<NewsItem
								key={index}
								title={item.title}
								description={item.description}
								source={item.source}
								publishedAt={item.publishedAt}
								link={'link' in item ? (item.link as string) : undefined}
								index={index}
								onClick={openNewsLink}
							/>
						))}
					</NewsContainer>
				</WidgetContainer>
			)}
		</>
	)
}
