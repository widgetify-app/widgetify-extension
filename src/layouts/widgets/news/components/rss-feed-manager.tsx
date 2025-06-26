import { Button } from '@/components/button/button'
import { CheckBoxWithDescription } from '@/components/checkbox-description.component'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useState } from 'react'
import { BiRss } from 'react-icons/bi'
import { VscAdd, VscTrash } from 'react-icons/vsc'
import type { RssNewsState } from '../news.interface'

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

interface RssFeedManagerProps {
	isOpen: boolean
	onClose: (rssState: RssNewsState & { changed: boolean }) => void
	rssNews: RssNewsState
}

export const RssFeedManager = ({ isOpen, onClose, rssNews }: RssFeedManagerProps) => {
	if (!isOpen) return null
	const [newFeed, setNewFeed] = useState<{ name: string; url: string }>({
		name: '',
		url: '',
	})
	const [error, setError] = useState<string | null>(null)
	const [rssState, setRssState] = useState<RssNewsState>(rssNews)

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
		} catch (e) {
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

		setError(null)
	}

	const validateUrl = (url: string) => {
		if (!url.trim()) return

		try {
			new URL(url)
			setError(null)
		} catch (e) {
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

	const onCloseModal = () => {
		// Check if the state has changed
		const hasChanged = JSON.stringify(rssState) !== JSON.stringify(rssNews)
		if (hasChanged) {
			onClose({ ...rssState, changed: true })
		} else {
			onClose({ ...rssState, changed: false })
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onCloseModal}
			title="مدیریت فیدهای خبری"
			size="lg"
			direction="rtl"
		>
			<LazyMotion features={domAnimation}>
				<div className="flex flex-col w-full gap-6 px-2 mx-auto overflow-y-auto h-96">
					<CheckBoxWithDescription
						isEnabled={rssState.useDefaultNews}
						onToggle={toggleDefaultNews}
						title="استفاده از منابع خبری پیش‌فرض"
						description="با فعال کردن این گزینه، اخبار از منابع پیش‌فرض نمایش داده می‌شوند"
					/>

					<section
						className={'p-4 rounded-2xl border bg-content border-content'}
					>
						<h3 className={'mb-3 text-sm font-medium'}>
							افزودن فید RSS جدید
						</h3>
						<div className="flex flex-col gap-3">
							<TextInput
								type="text"
								placeholder="نام فید (مثال: دیجیاتو)"
								value={newFeed.name}
								onChange={(value) =>
									setNewFeed({ ...newFeed, name: value })
								}
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
					</section>

					{/* Suggested Feeds Section */}
					<section className="mt-2">
						<div className="flex items-center justify-between mb-3">
							<h3 className={'text-sm font-medium text-content'}>
								فیدهای پیشنهادی
							</h3>
						</div>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
							{SUGGESTED_FEEDS.filter(
								(feed) => !isFeedAlreadyAdded(feed.url)
							).map((feed) => (
								<m.div
									key={feed.url}
									className={
										'flex items-center justify-center p-2 border rounded-xl cursor-pointer bg-content border-content'
									}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => addSuggestedFeed(feed)}
								>
									<span
										className={'font-medium text-light text-center'}
									>
										{feed.name}
									</span>
								</m.div>
							))}
						</div>
					</section>

					<section className="mt-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className={'text-sm font-medium text-content'}>
								فیدهای شما
							</h3>
							{rssState.customFeeds.length > 0 && (
								<div className={'text-xs text-muted'}>
									{rssState.customFeeds.length} فید
								</div>
							)}
						</div>
						<FeedsList
							feeds={rssState.customFeeds}
							onToggleFeed={(id) => onToggleFeed(id)}
							onRemoveFeed={onRemoveFeed}
						/>
					</section>
				</div>
			</LazyMotion>
		</Modal>
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
		<div className="min-h-[150px]">
			{feeds.length === 0 ? (
				<m.div
					className={
						'flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg border-content'
					}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<BiRss className={'mb-3 opacity-50 text-content'} size={32} />
					<p className={'mb-1 text-sm font-medium opacity-70 text-content'}>
						هیچ فید RSS اضافه نشده است
					</p>
					<p className={'text-xs opacity-50'}>
						از فرم بالا برای افزودن فید استفاده کنید
					</p>
				</m.div>
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
		<m.div
			className={`flex items-center justify-between px-2.5 py-2 transition-colors rounded-3xl bg-content border border-content ${!feed.enabled && 'opacity-60'} ${disabled && 'cursor-not-allowed'}`}
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
			layout
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
		</m.div>
	)
}
