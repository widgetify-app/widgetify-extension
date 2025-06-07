import { getFromStorage, setToStorage } from '@/common/storage'
import { sleep } from '@/common/utils/timeout'
import { RequireAuth } from '@/components/auth/require-auth'
import {
	type FetchedYouTubeProfile,
	useGetYouTubeProfile,
} from '@/services/hooks/youtube/getYouTubeProfile.hook'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiYoutube } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import {
	type YouTubeSettings,
	YouTubeSettingsModal,
} from './components/youtube-settings-modal'
import { YouTubeStatsCard } from './components/youtube-stats-card'

export function YouTubeLayout() {
	const [showSettings, setShowSettings] = useState(false)
	const [username, setUsername] = useState('')
	const [subscriptionStyle, setSubscriptionStyle] = useState<'short' | 'long'>('short')
	const [youtubeProfile, setYoutubeProfile] = useState<
		FetchedYouTubeProfile & { isCached?: boolean }
	>()
	const [canRequest, setCanRequest] = useState(false)

	const {
		data: youtubeData,
		isLoading,
		error,
	} = useGetYouTubeProfile(username, {
		enabled: username.length > 0 && canRequest,
		refetchInterval: 2 * 60 * 1000, // 2 minutes
	})
	useEffect(() => {
		const loadSettings = async () => {
			const storedSettings = await getFromStorage('youtubeSettings')
			if (storedSettings?.username) {
				setUsername(storedSettings.username)
			}
			if (storedSettings?.subscriptionStyle) {
				setSubscriptionStyle(storedSettings.subscriptionStyle)
			}

			const profile = await getFromStorage('youtubeProfile')
			if (profile) {
				setYoutubeProfile(profile)
			}

			await sleep(ms('5s'))
			setCanRequest(true)
		}
		loadSettings()
	}, [])

	useEffect(() => {
		if (youtubeData) {
			setYoutubeProfile({
				id: youtubeData.id,
				name: youtubeData.name,
				profile: youtubeData.profile,
				subscribers: youtubeData.subscribers,
				totalViews: youtubeData.totalViews,
				totalVideos: youtubeData.totalVideos,
				createdAt: youtubeData.createdAt,
			})

			setToStorage('youtubeProfile', { ...youtubeData, isCached: true })
		}
	}, [youtubeData])

	const handleSettingsClose = async (data: YouTubeSettings | null) => {
		setShowSettings(false)

		if (data) {
			setUsername(data.username || '')
			setSubscriptionStyle(data.subscriptionStyle || 'short')
		}
	}

	return (
<<<<<<< HEAD
		<>
			<WidgetContainer className="flex flex-col">
				<RequireAuth mode="preview">
					{/* Header */}
					<div
						className="flex items-center justify-between pb-2 mb-3 border-b"
						style={{
							borderColor: 'rgba(0,0,0,0.1)',
						}}
					>
						<div className="flex items-center gap-2">
							<FiYoutube className="w-5 h-5 text-red-500" />
							<h3 className={'text-sm font-medium text-content'}>
								آمار یوتیوب ( آزمایشی )
							</h3>
=======
		<WidgetContainer className="youtube-layout">
			<RequireAuth mode="preview">
				{/* Header */}
				<div
					className="flex items-center justify-between pb-2 mb-3 border-b"
					style={{
						borderColor:
							theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
					}}
				>
					<div className="flex items-center gap-2">
						<FiYoutube className="w-5 h-5 text-red-500" />
						<h3 className={`text-sm font-medium ${getTextColor(theme)}`}>
							آمار یوتیوب ( آزمایشی )
						</h3>
					</div>

					<button
						className="p-1 transition-transform duration-150 ease-in-out rounded-full cursor-pointer hover:bg-gray-500/10 hover:scale-110 active:scale-90"
						onClick={() => setShowSettings(true)}
					>
						<FaGear className="w-3 h-3 opacity-70 hover:opacity-100" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto">
					{!youtubeProfile && isLoading && (
						<div className="flex items-center justify-center h-32">
							<div className="w-6 h-6 border-2 border-t-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
>>>>>>> c6d9a541c508f834068ac3fc29dd3277a17f91b2
						</div>
					)}
					{!youtubeProfile && error && !isLoading && (
						<div className="py-8 text-center">
							<FiYoutube className="w-12 h-12 mx-auto mb-3 text-red-500 opacity-50" />
							<p className={`text-sm ${getTextColor(theme)} opacity-70`}>
								خطا در دریافت اطلاعات
							</p>
							<p className={`text-xs ${getTextColor(theme)} opacity-50 mt-1`}>
								نام کاربری را بررسی کنید
							</p>
						</div>
					)}

					{!username && !isLoading && (
						<div className="py-8 text-center">
							<FiYoutube className="w-12 h-12 mx-auto mb-3 text-red-500 opacity-30" />
							<p className={`text-sm ${getTextColor(theme)} opacity-70`}>
								لطفاً از تنظیمات نام کاربری یوتیوب را وارد کنید
							</p>
							<button
								onClick={() => setShowSettings(true)}
								className="px-3 py-1 mt-2 text-xs text-red-500 transition-colors border rounded-lg cursor-pointer bg-red-500/10 hover:bg-red-500/20 border-red-500/30"
							>
								تنظیمات
							</button>
						</div>
					)}

<<<<<<< HEAD
					{/* Content */}
					<div className="flex-1 overflow-auto">
						{!youtubeProfile && isLoading && (
							<div className="flex items-center justify-center h-32">
								<div className="w-6 h-6 border-2 border-t-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
							</div>
						)}
						{!youtubeProfile && error && !isLoading && (
							<div className="py-8 text-center">
								<FiYoutube className="w-12 h-12 mx-auto mb-3 text-red-500 opacity-50" />
								<p className={'text-sm text-content opacity-70'}>
									خطا در دریافت اطلاعات
								</p>
								<p className={'text-xs text-muted mt-1'}>
									نام کاربری را بررسی کنید
								</p>
							</div>
						)}

						{!username && !isLoading && (
							<div className="py-8 text-center">
								<FiYoutube className="w-12 h-12 mx-auto mb-3 text-red-500 opacity-30" />
								<p className={'text-sm text-muted'}>
									لطفاً از تنظیمات نام کاربری یوتیوب را وارد کنید
								</p>
								<button
									onClick={() => setShowSettings(true)}
									className="px-3 py-1 mt-2 text-xs text-red-500 transition-colors border rounded-lg cursor-pointer bg-red-500/10 hover:bg-red-500/20 border-red-500/30"
								>
									تنظیمات
								</button>
							</div>
						)}

						{youtubeProfile && username && (
							<YouTubeStatsCard
								data={youtubeProfile}
								username={username}
								subscriptionStyle={subscriptionStyle}
							/>
						)}
					</div>
				</RequireAuth>
			</WidgetContainer>{' '}
=======
					{youtubeProfile && username && (
						<YouTubeStatsCard
							data={youtubeProfile}
							username={username}
							subscriptionStyle={subscriptionStyle}
						/>
					)}
				</div>
			</RequireAuth>
>>>>>>> c6d9a541c508f834068ac3fc29dd3277a17f91b2
			<YouTubeSettingsModal isOpen={showSettings} onClose={handleSettingsClose} />
		</WidgetContainer>
	)
}
