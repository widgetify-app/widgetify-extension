import { useState } from 'react'
import { BiRss } from 'react-icons/bi'
import { VscAdd, VscTrash } from 'react-icons/vsc'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { CheckBoxWithDescription } from '@/components/checkbox-description.component'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import type { WigiNewsSetting } from './news.interface'

const SUGGESTED_FEEDS = [
	{
		name: 'زومیت',
		url: 'https://www.zoomit.ir/feed/',
	},
	{
		name: '⚽ ورزش 3',
		url: 'https://www.varzesh3.com/rss/all',
	},
	{
		name: 'خبر فارسی',
		url: 'https://khabarfarsi.com/rss/top',
	},
]

export const RssFeedSetting = () => {
	const [newFeed, setNewFeed] = useState<{ name: string; url: string }>({
		name: '',
		url: '',
	})
	const [error, setError] = useState<string | null>(null)
	const [rssState, setRssState] = useState<WigiNewsSetting>({
		customFeeds: [],
		useDefaultNews: false,
		lastFetchedItems: {},
	})
	const isInitialLoad = useRef(true)

	const toggleDefaultNews = () => {
		const newState = { ...rssState, useDefaultNews: !rssState.useDefaultNews }
		setRssState(newState)
	}

	const addNewFeed = () => {
		if (!newFeed.name.trim() || !newFeed.url.trim()) {
			setError('نام و آدرس فید الزامی است')
			return
		}

		// Validate URL
		try {
			new URL(newFeed.url)
		} catch {
			setError('آدرس فید معتبر نیست')
			return
		}

		const newId = `feed-${Date.now()}`

		setRssState({
			...rssState,
			customFeeds: [
				...rssState.customFeeds,
				{
					id: newId,
					name: newFeed.name,
					url: newFeed.url,
					enabled: true,
				},
			],
		})

		Analytics.event('rss_feed_added')

		setNewFeed({ name: '', url: '' })
		setError(null)
	}

	const addSuggestedFeed = (suggestedFeed: { name: string; url: string }) => {
		const feedExists = rssState.customFeeds.some(
			(feed) => feed.url.toLowerCase() === suggestedFeed.url.toLowerCase()
		)

		if (feedExists) {
			setError(`فید "${suggestedFeed.name}" قبلاً اضافه شده است`)
			return
		}

		const newId = `feed-${Date.now()}`

		const newFeed = {
			id: newId,
			name: suggestedFeed.name,
			url: suggestedFeed.url,
			enabled: true,
		}

		setRssState({
			...rssState,
			customFeeds: [...rssState.customFeeds, newFeed],
		})
		setNewFeed({ name: '', url: '' })
		Analytics.event('rss_feed_suggested_added')

		setError(null)
	}

	const validateUrl = (url: string) => {
		if (!url.trim()) return

		try {
			new URL(url)
			setError(null)
		} catch (_e) {
			setError('آدرس فید معتبر نیست')
		}
	}

	const isFeedAlreadyAdded = (url: string): boolean => {
		return rssState.customFeeds.some(
			(feed) => feed.url.toLowerCase() === url.toLowerCase()
		)
	}

	const onRemoveFeed = (id: string) => {
		setRssState({
			...rssState,
			customFeeds: rssState.customFeeds.filter((feed) => feed.id !== id),
		})

		Analytics.event('rss_feed_removed')
	}

	const onToggleFeed = (id: string) => {
		const feedIndex = rssState.customFeeds.findIndex((feed) => feed.id === id)
		if (feedIndex !== -1) {
			const updatedFeeds = [...rssState.customFeeds]
			updatedFeeds[feedIndex] = {
				...updatedFeeds[feedIndex],
				enabled: !updatedFeeds[feedIndex].enabled,
			}

			setRssState({
				...rssState,
				customFeeds: updatedFeeds,
			})
		}
	}

	const save = async () => {
		callEvent('wigiNewsSettingsChanged', rssState)
		await setToStorage('rss_news_state', rssState)
	}

	useEffect(() => {
		async function load() {
			const settingFromStorage = await getFromStorage('rss_news_state')
			if (settingFromStorage) {
				setRssState({
					customFeeds: settingFromStorage.customFeeds || [],
					useDefaultNews: settingFromStorage.useDefaultNews || false,
					lastFetchedItems: settingFromStorage.lastFetchedItems || {},
				})
			}
			isInitialLoad.current = false
		}

		load()
	}, [])

	useEffect(() => {
		if (isInitialLoad.current) return

		save()
	}, [rssState])

	return (
		<WidgetSettingWrapper>
			{/* error section */}
			{error && (
				<div className="p-3 mb-3 text-sm rounded-lg bg-error/20 text-error">
					{error}
				</div>
			)}
			<SectionPanel title="تنظیمات کلی" size="sm">
				<CheckBoxWithDescription
					isEnabled={rssState.useDefaultNews}
					onToggle={toggleDefaultNews}
					title="استفاده از منابع خبری پیش‌فرض"
					description="با فعال کردن این گزینه، اخبار از منابع پیش‌فرض نمایش داده می‌شوند"
				/>
			</SectionPanel>

			<SectionPanel title="افزودن فید RSS جدید" size="sm">
				<div className="flex flex-col gap-3">
					<TextInput
						type="text"
						placeholder="نام فید (مثال: دیجیاتو)"
						value={newFeed.name}
						onChange={(value) => setNewFeed({ ...newFeed, name: value })}
					/>
					<TextInput
						type="url"
						placeholder="آدرس RSS (مثال: https://digiato.com/feed)"
						value={newFeed.url}
						onChange={(value) => {
							setNewFeed({ ...newFeed, url: value })
							validateUrl(value)
						}}
					/>

					<Button
						size="md"
						className="text-white rounded-xl btn-primary"
						onClick={addNewFeed}
					>
						<VscAdd size={16} />
						<span>افزودن فید جدید</span>
					</Button>
				</div>
			</SectionPanel>

			{/* Suggested Feeds Section */}
			<SectionPanel title="فیدهای پیشنهادی" size="sm">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
					{SUGGESTED_FEEDS.filter((feed) => !isFeedAlreadyAdded(feed.url)).map(
						(feed) => (
							<div
								key={feed.url}
								className={
									'flex items-center justify-center p-2 border rounded-xl cursor-pointer bg-content border-content'
								}
								onClick={() => addSuggestedFeed(feed)}
							>
								<span className={'font-medium text-light text-center'}>
									{feed.name}
								</span>
							</div>
						)
					)}
				</div>
			</SectionPanel>

			<SectionPanel title={`فیدهای شما (${rssState.customFeeds.length})`} size="sm">
				<FeedsList
					feeds={rssState.customFeeds}
					onToggleFeed={(id) => onToggleFeed(id)}
					onRemoveFeed={onRemoveFeed}
				/>
			</SectionPanel>
		</WidgetSettingWrapper>
	)
}

interface FeedsListProps {
	feeds: Array<{
		id: string
		name: string
		url: string
		enabled: boolean
	}>
	isLoading?: boolean
	onToggleFeed: (id: string) => void
	onRemoveFeed: (id: string) => void
}

const FeedsList = ({ feeds, onToggleFeed, onRemoveFeed }: FeedsListProps) => {
	return (
		<div className="h-full">
			{feeds.length === 0 ? (
				<div
					className={
						'flex flex-col items-center justify-center p-2 text-center border border-dashed rounded-lg border-content'
					}
				>
					<BiRss className={'mb-3 opacity-50 text-content'} size={32} />
					<p className={'mb-1 text-sm font-medium opacity-70 text-content'}>
						هیچ فید RSS اضافه نشده است
					</p>
					<p className={'text-xs opacity-50'}>
						از فرم بالا برای افزودن فید استفاده کنید
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{feeds.map((feed) => (
						<FeedItem
							key={feed.id}
							feed={feed}
							onToggle={() => onToggleFeed(feed.id)}
							onRemove={() => onRemoveFeed(feed.id)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

interface FeedItemProps {
	feed: {
		id: string
		name: string
		url: string
		enabled: boolean
	}
	disabled?: boolean
	onToggle: () => void
	onRemove: () => void
}

const FeedItem = ({ feed, disabled = false, onToggle, onRemove }: FeedItemProps) => {
	const getTextStyle = () => {
		const baseStyle = feed.enabled ? 'font-medium' : 'line-through opacity-70'
		return `${baseStyle} text-content`
	}

	return (
		<div
			className={`flex items-center justify-between px-2.5 py-2 transition-colors rounded-3xl bg-content border border-content ${!feed.enabled && 'opacity-60'} ${disabled && 'cursor-not-allowed'}`}
		>
			<div className="flex items-center flex-1 gap-3">
				<ToggleSwitch
					enabled={feed.enabled}
					disabled={disabled}
					onToggle={onToggle}
				/>
				<div className="overflow-hidden">
					<span className={`block truncate ${getTextStyle()}`}>
						{feed.name}
					</span>
					<span className={'block text-xs truncate text-muted'}>
						{feed.url}
					</span>
				</div>
			</div>
			<Button
				size="sm"
				className={
					'btn btn-circle h-9 w-9 bg-error/10 hover:!bg-error/20 text-error border-none shadow-none rounded-full transition-colors duration-300 ease-in-out'
				}
				onClick={onRemove}
				disabled={disabled}
			>
				<VscTrash size={18} />
			</Button>
		</div>
	)
}
