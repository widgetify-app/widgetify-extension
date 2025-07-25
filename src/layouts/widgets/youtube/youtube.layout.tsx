import { getFromStorage, setToStorage } from '@/common/storage'
import { sleep } from '@/common/utils/timeout'
import { RequireAuth } from '@/components/auth/require-auth'
import { Button } from '@/components/button/button'
import {
	type FetchedYouTubeProfile,
	useGetYouTubeProfile,
} from '@/services/hooks/youtube/getYouTubeProfile.hook'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { FaYoutube } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
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
		<>
			<WidgetContainer className="flex flex-col">
				<RequireAuth mode="preview">
					{/* Header */}
					<div
						className="flex items-center justify-between"
						style={{
							borderColor: 'rgba(0,0,0,0.1)',
						}}
					>
						<div className="flex items-center gap-2">
							<FaYoutube className="w-5 h-5 text-red-500" />
							<h3 className={'text-sm font-medium text-content'}>
								آمار یوتیوب
							</h3>
							<span className="bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary rounded-2xl">
								آزمایشی
							</span>
						</div>

						<Button
							size="xs"
							onClick={() => setShowSettings(true)}
							className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
						>
							<FiSettings size={12} className="text-content" />
						</Button>
					</div>

					{/* Content */}
					<div className="mt-2 flex-1 overflow-auto">
						{!youtubeProfile && isLoading && (
							<div className="py-28 flex items-center justify-center">
								<div className="w-6 h-6 border-2 border-t-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
							</div>
						)}

						{!youtubeProfile && error && !isLoading && (
							<div
								className={
									'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-20'
								}
							>
								<div
									className={
										'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
									}
								>
									<FaYoutube className="text-content" size={24} />
								</div>
								<p className="mt-1 text-center text-content">
									خطا در دریافت اطلاعات نام کاربری را بررسی کنید کنید.
								</p>
							</div>
						)}

						{!username && !isLoading && (
							<div
								className={
									'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-20'
								}
							>
								<div
									className={
										'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
									}
								>
									<FaYoutube className="text-content" size={24} />
								</div>
								<p className="mt-1 text-center text-content">
									لطفاً از تنظیمات نام کاربری یوتیوب را وارد کنید.
								</p>
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
			<YouTubeSettingsModal isOpen={showSettings} onClose={handleSettingsClose} />
		</>
	)
}
