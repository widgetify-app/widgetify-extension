import { getFromStorage } from '@/common/storage'
import { RequireAuth } from '@/components/auth/require-auth'
import { getTextColor, useTheme } from '@/context/theme.context'
import { useGetYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
import { useEffect, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiYoutube } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import {
	type YouTubeSettings,
	YouTubeSettingsModal,
} from './components/youtube-settings-modal.tsx'
import { YouTubeStatsCard } from './components/youtube-stats-card.tsx'

export function YouTubeLayout() {
	const { theme } = useTheme()
	const [showSettings, setShowSettings] = useState(false)
	const [username, setUsername] = useState('')
	const [subscriptionStyle, setSubscriptionStyle] = useState<'short' | 'long'>('short')

	const {
		data: youtubeData,
		isLoading,
		error,
	} = useGetYouTubeProfile(username, {
		enabled: username.length > 0,
		refetchInterval: 5 * 60 * 1000, // 5 minutes
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
		}
		loadSettings()
	}, [])
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
						className="flex items-center justify-between pb-2 mb-3 border-b"
						style={{
							borderColor:
								theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
						}}
					>
						<div className="flex items-center gap-2">
							<FiYoutube className="w-5 h-5 text-red-500" />
							<h3 className={`text-sm font-medium ${getTextColor(theme)}`}>
								آمار یوتیوب
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
						{isLoading && (
							<div className="flex items-center justify-center h-32">
								<div className="w-6 h-6 border-2 border-t-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
							</div>
						)}
						{error && !isLoading && (
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
						{youtubeData && !isLoading && !error && (
							<YouTubeStatsCard
								data={youtubeData}
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
