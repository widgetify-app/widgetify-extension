import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { AvailableRssFeed } from '@/services/news/get-rss-feeds.hook'
import type { WigiNewsSetting } from '../types'

const DEFAULT_SETTINGS: WigiNewsSetting = {
	customFeeds: [],
	useDefaultNews: true,
}

export function useNewsSettings() {
	const [settings, setSettings] = useState<WigiNewsSetting>(DEFAULT_SETTINGS)

	useEffect(() => {
		async function load() {
			const data = await getFromStorage('rssOptions')
			if (data) {
				setSettings({
					customFeeds: data.customFeeds || [],
					useDefaultNews: data.useDefaultNews ?? true,
				})
			}
		}

		const unlisten = listenEvent(
			'wigiNewsSettingsChanged',
			(data: WigiNewsSetting) => {
				setSettings(structuredClone(data))
			}
		)

		load()
		return () => {
			unlisten()
		}
	}, [])

	const updateSettings = (updater: (prev: WigiNewsSetting) => WigiNewsSetting) => {
		const next = updater(settings)
		setSettings(next)
		setToStorage('rssOptions', next)
		callEvent('wigiNewsSettingsChanged', next)
	}

	const toggleDefaultNews = () => {
		updateSettings((prev) => ({
			...prev,
			useDefaultNews: !prev.useDefaultNews,
		}))
		Analytics.event('rss_default_news_toggled')
	}

	const toggleFeed = (feed: AvailableRssFeed) => {
		updateSettings((prev) => {
			const exists = prev.customFeeds.some(
				(f) => f.url.toLowerCase() === feed.url.toLowerCase()
			)

			const customFeeds = exists
				? prev.customFeeds.filter(
						(f) => f.url.toLowerCase() !== feed.url.toLowerCase()
					)
				: [
						...prev.customFeeds,
						{
							id: feed.id || feed.url,
							name: feed.name,
							url: feed.url,
							enabled: true,
						},
					]

			return { ...prev, customFeeds }
		})
		Analytics.event('rss_feed_toggled')
	}

	const isFeedActive = (url: string) => {
		return settings.customFeeds.some(
			(f) => f.url.toLowerCase() === url.toLowerCase() && f.enabled !== false
		)
	}

	return {
		settings,
		toggleDefaultNews,
		toggleFeed,
		isFeedActive,
	}
}
