import { getFromStorage, setToStorage } from '@/common/storage'
import { CheckBoxWithDescription } from '@/components/checkbox-description.component'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useTheme } from '@/context/theme.context'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { VscAdd, VscCloudDownload, VscTrash } from 'react-icons/vsc'
import type { RssNewsState } from '../news.interface'

const SUGGESTED_FEEDS = [
	{
		name: 'زومیت',
		url: 'https://www.zoomit.ir/feed/',
	},
	{
		name: 'خبر فارسی',
		url: 'https://khabarfarsi.com/rss/top',
	},
	{
		name: 'نیویورک تایمز - خاورمیانه',
		url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
	},
]

interface RssFeedManagerProps {
	isOpen: boolean
	onClose: () => void
	onUpdate: () => void
}

export const RssFeedManager = ({ isOpen, onClose, onUpdate }: RssFeedManagerProps) => {
	const { theme, themeUtils } = useTheme()
	const [newFeed, setNewFeed] = useState<{ name: string; url: string }>({
		name: '',
		url: '',
	})
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [rssState, setRssState] = useState<RssNewsState>({
		customFeeds: [],
		useDefaultNews: false,
		lastFetchedItems: {},
	})

	useEffect(() => {
		loadRssState()
	}, [])

	const loadRssState = async () => {
		setIsLoading(true)
		try {
			const savedState = await getFromStorage('rss_news_state')
			if (savedState) {
				setRssState(savedState)
			}
		} finally {
			setIsLoading(false)
		}
	}

	const saveRssState = async (newState: RssNewsState) => {
		setIsLoading(true)
		try {
			await setToStorage('rss_news_state', newState)
			setRssState(newState)
			onUpdate()
		} finally {
			setIsLoading(false)
		}
	}

	const toggleDefaultNews = () => {
		const newState = { ...rssState, useDefaultNews: !rssState.useDefaultNews }
		saveRssState(newState)
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

		const newState = { ...rssState }
		const newId = `feed-${Date.now()}`

		newState.customFeeds.push({
			id: newId,
			name: newFeed.name,
			url: newFeed.url,
			enabled: true,
		})

		saveRssState(newState)
		setNewFeed({ name: '', url: '' })
		setError(null)
	}

	const addSuggestedFeed = (suggestedFeed: { name: string; url: string }) => {
		const feedExists = rssState.customFeeds.some(
			(feed) => feed.url.toLowerCase() === suggestedFeed.url.toLowerCase(),
		)

		if (feedExists) {
			setError(`فید "${suggestedFeed.name}" قبلاً اضافه شده است`)
			return
		}

		const newState = { ...rssState }
		const newId = `feed-${Date.now()}`

		newState.customFeeds.push({
			id: newId,
			name: suggestedFeed.name,
			url: suggestedFeed.url,
			enabled: true,
		})

		saveRssState(newState)
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
			(feed) => feed.url.toLowerCase() === url.toLowerCase(),
		)
	}

	const getFormSectionStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-50/80 border-gray-200 dark:border-gray-800'
			case 'dark':
				return 'bg-gray-800/30 border-gray-700/50'
			default: // glass
				return 'bg-white/5 backdrop-blur-sm border-white/10'
		}
	}

	const getErrorStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-50 text-red-600'
			case 'dark':
				return 'bg-red-900/30 text-red-300'
			default: // glass
				return 'bg-red-900/20 backdrop-blur-sm text-red-300'
		}
	}

	const getAddButtonStyle = () => {
		if (isLoading) return 'opacity-70 cursor-not-allowed'

		switch (theme) {
			case 'light':
				return 'bg-blue-500 hover:bg-blue-600 text-white'
			case 'dark':
				return 'bg-blue-600 hover:bg-blue-700 text-white'
			default: // glass
				return 'bg-blue-500/80 hover:bg-blue-600/90 text-white backdrop-blur-sm'
		}
	}

	const getSuggestedFeedStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-50 hover:bg-gray-100 border-gray-200'
			case 'dark':
				return 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50'
			default: // glass
				return 'bg-white/10 hover:bg-white/15 border-white/10 backdrop-blur-sm'
		}
	}

	const onRemoveFeed = (id: string) => {
		rssState.customFeeds = rssState.customFeeds.filter((feed) => feed.id !== id)
		saveRssState(rssState)
	}

	if (!isOpen) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="مدیریت فیدهای خبری"
			size="lg"
			direction="rtl"
		>
			<div className="flex flex-col w-full gap-6 p-4 mx-auto overflow-y-auto h-96">
				<CheckBoxWithDescription
					isEnabled={rssState.useDefaultNews}
					onToggle={toggleDefaultNews}
					title="استفاده از منابع خبری پیش‌فرض"
					description="با فعال کردن این گزینه، اخبار از منابع پیش‌فرض نمایش داده می‌شوند"
				/>

				<section className={`p-4 border rounded-xl ${getFormSectionStyle()}`}>
					<h3 className={`mb-3 text-sm font-medium ${themeUtils.getHeadingTextStyle()}`}>
						افزودن فید RSS جدید
					</h3>
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

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="overflow-hidden"
								>
									<p className={`p-2 text-sm rounded ${getErrorStyle()}`}>{error}</p>
								</motion.div>
							)}
						</AnimatePresence>

						<motion.button
							onClick={addNewFeed}
							disabled={isLoading}
							className={clsx(
								`flex items-center justify-center gap-2 px-4 py-2 transition-colors rounded-md cursor-pointer ${getAddButtonStyle()}`,
							)}
							whileHover={{ scale: isLoading ? 1 : 1.02 }}
							whileTap={{ scale: isLoading ? 1 : 0.98 }}
						>
							<VscAdd size={16} />
							<span>افزودن فید جدید</span>
						</motion.button>
					</div>
				</section>

				{/* Suggested Feeds Section */}
				<section className="mt-2">
					<div className="flex items-center justify-between mb-3">
						<h3 className={`text-sm font-medium ${themeUtils.getHeadingTextStyle()}`}>
							فیدهای پیشنهادی
						</h3>
					</div>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
						{SUGGESTED_FEEDS.filter((feed) => !isFeedAlreadyAdded(feed.url)).map(
							(feed) => (
								<motion.div
									key={feed.url}
									className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer ${getSuggestedFeedStyle()}`}
									whileHover={{ scale: isLoading ? 1 : 1.02 }}
									whileTap={{ scale: isLoading ? 1 : 0.98 }}
									onClick={() => !isLoading && addSuggestedFeed(feed)}
								>
									<span
										className={`font-medium text-light text-center ${themeUtils.getTextColor()}`}
									>
										{feed.name}
									</span>
								</motion.div>
							),
						)}
					</div>
				</section>

				<section className="mt-4">
					<div className="flex items-center justify-between mb-3">
						<h3 className={`text-sm font-medium ${themeUtils.getHeadingTextStyle()}`}>
							فیدهای شما
						</h3>
						{rssState.customFeeds.length > 0 && (
							<div className={`text-xs ${themeUtils.getDescriptionTextStyle()}`}>
								{rssState.customFeeds.length} فید
							</div>
						)}
					</div>
					<FeedsList
						feeds={rssState.customFeeds}
						isLoading={isLoading}
						onToggleFeed={(id) => {
							const newState = { ...rssState }
							const feedIndex = newState.customFeeds.findIndex((feed) => feed.id === id)
							if (feedIndex >= 0) {
								newState.customFeeds[feedIndex].enabled =
									!newState.customFeeds[feedIndex].enabled
								saveRssState(newState)
							}
						}}
						onRemoveFeed={onRemoveFeed}
					/>
				</section>
			</div>
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

const FeedsList = ({
	feeds,
	isLoading = false,
	onToggleFeed,
	onRemoveFeed,
}: FeedsListProps) => {
	const { theme, themeUtils } = useTheme()

	const getEmptyStateStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-200 text-gray-500'
			case 'dark':
				return 'border-gray-700 text-gray-400'
			default: // glass
				return 'border-gray-700/30 text-gray-400'
		}
	}

	return (
		<div className="min-h-[150px]">
			{feeds.length === 0 ? (
				<motion.div
					className={`flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg ${getEmptyStateStyle()}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<VscCloudDownload className="mb-3 opacity-50" size={32} />
					<p className="mb-1 text-sm font-medium opacity-70">
						هیچ فید RSS اضافه نشده است
					</p>
					<p className={`text-xs opacity-50 ${themeUtils.getDescriptionTextStyle()}`}>
						از فرم بالا برای افزودن فید استفاده کنید
					</p>
				</motion.div>
			) : (
				<div className="space-y-2">
					{feeds.map((feed) => (
						<FeedItem
							key={feed.id}
							feed={feed}
							disabled={isLoading}
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
	const { theme, themeUtils } = useTheme()

	const getItemStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/90 border border-gray-200 hover:bg-gray-50/80'
			case 'dark':
				return 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30'
			default: // glass
				return 'bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10'
		}
	}

	const getDeleteButtonStyle = () => {
		if (disabled)
			return 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-red-500'

		switch (theme) {
			case 'light':
				return 'text-red-500 hover:text-red-700 hover:bg-red-50'
			case 'dark':
				return 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
			default: // glass
				return 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
		}
	}

	const getTextStyle = () => {
		const baseStyle = feed.enabled ? 'font-medium' : 'line-through opacity-70'
		return `${baseStyle} ${themeUtils.getTextColor()}`
	}

	const getUrlStyle = () => {
		return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
	}

	return (
		<motion.div
			className={clsx(
				`flex items-center justify-between px-4 py-3 transition-colors rounded-lg ${getItemStyle()}`,
				!feed.enabled && 'opacity-60',
				disabled && 'cursor-not-allowed',
			)}
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
			layout
			whileHover={{ scale: disabled ? 1 : 1.01 }}
		>
			<div className="flex items-center flex-1 gap-3">
				<ToggleSwitch enabled={feed.enabled} disabled={disabled} onToggle={onToggle} />
				<div className="overflow-hidden">
					<span className={clsx('block truncate', getTextStyle())}>{feed.name}</span>
					<span className={`block text-xs truncate ${getUrlStyle()}`}>{feed.url}</span>
				</div>
			</div>
			<motion.button
				onClick={onRemove}
				disabled={disabled}
				className={clsx(
					`p-2 ml-2 transition-colors cursor-pointer rounded-full ${getDeleteButtonStyle()}`,
				)}
				whileHover={{ scale: disabled ? 1 : 1.1 }}
				whileTap={{ scale: disabled ? 1 : 0.9 }}
			>
				<VscTrash size={18} />
			</motion.button>
		</motion.div>
	)
}

interface ToggleSwitchProps {
	enabled: boolean
	disabled?: boolean
	onToggle: () => void
}

const ToggleSwitch = ({ enabled, disabled = false, onToggle }: ToggleSwitchProps) => {
	const { theme } = useTheme()

	const getTrackStyle = () => {
		if (enabled) {
			return theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-300'
			case 'dark':
				return 'bg-gray-600'
			default: // glass
				return 'bg-gray-700/50'
		}
	}

	return (
		<motion.div
			className={clsx('w-12 h-6 relative rounded-full transition-colors', {
				[getTrackStyle()]: true,
				'cursor-pointer': !disabled,
				'cursor-not-allowed opacity-70': disabled,
			})}
			onClick={disabled ? undefined : onToggle}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
		>
			<motion.span
				className="absolute w-4 h-4 bg-white rounded-full shadow-sm top-1 left-1"
				animate={{
					x: enabled ? 24 : 0,
				}}
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			/>
		</motion.div>
	)
}
