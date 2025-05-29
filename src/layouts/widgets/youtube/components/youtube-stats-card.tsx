import { getBorderColor, getTextColor, useTheme } from '@/context/theme.context'
import type { FetchedYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
import { motion } from 'framer-motion'
import { FiCalendar, FiEye, FiUsers, FiVideo } from 'react-icons/fi'

interface YouTubeStatsCardProps {
	username: string
	subscriptionStyle?: 'short' | 'long'
	data: FetchedYouTubeProfile & { isCached?: boolean }
}

export function YouTubeStatsCard({
	data,
	username,
	subscriptionStyle = 'short',
}: YouTubeStatsCardProps) {
	const { theme } = useTheme()

	const formatNumber = (num: string, style: 'short' | 'long' = 'short') => {
		const number = Number.parseInt(num)

		if (style === 'long') {
			return number.toLocaleString('fa-IR')
		}

		const subs = Number(num)

		switch (true) {
			case subs >= 1e9:
				return `${(subs / 1e9).toFixed(1)}B`
			case subs >= 1e6:
				return `${(subs / 1e6).toFixed(1)}M`
			case subs >= 1e3:
				return `${(subs / 1e3).toFixed(1)}K`
			default:
				return subs.toLocaleString()
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('fa-IR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="px-1.5 space-y-1"
		>
			{/* Channel Info */}
			<div
				className="flex items-center gap-3 px-2 py-3 border rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20"
				dir="ltr"
			>
				<img
					src={data.profile}
					alt={data.name}
					className="object-cover w-12 h-12 border-2 rounded-full border-red-500/30"
					onError={(e) => {
						e.currentTarget.src =
							'https://via.placeholder.com/48x48/ff0000/ffffff?text=YT'
					}}
				/>
				<div className="flex-1 min-w-0">
					<h4 className={`font-medium text-sm truncate ${getTextColor(theme)}`}>
						{data.name}
					</h4>
					<p className={`text-xs opacity-70 ${getTextColor(theme)}`}>{username}</p>
				</div>
			</div>
			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-1">
				<div className={`p-3 rounded-lg border ${getBorderColor(theme)} bg-content`}>
					<div className="flex items-center gap-2 mb-1">
						<FiUsers className="w-4 h-4 text-red-500" />
						<span className={`text-xs ${getTextColor(theme)} opacity-70`}>مشترک</span>
					</div>{' '}
					<p className={`text-sm font-bold ${getTextColor(theme)}`}>
						{formatNumber(data.subscribers, subscriptionStyle)}
					</p>
				</div>

				<div className={`p-3 rounded-lg border ${getBorderColor(theme)} bg-content`}>
					<div className="flex items-center gap-2 mb-1">
						<FiEye className="w-4 h-4 text-blue-500" />
						<span className={`text-xs ${getTextColor(theme)} opacity-70`}>بازدید</span>
					</div>
					<p className={`text-sm font-bold ${getTextColor(theme)}`}>
						{formatNumber(data.totalViews)}
					</p>
				</div>

				<div className={`p-3 rounded-lg border ${getBorderColor(theme)} bg-content`}>
					<div className="flex items-center gap-2 mb-1">
						<FiVideo className="w-4 h-4 text-green-500" />
						<span className={`text-xs ${getTextColor(theme)} opacity-70`}>ویدیو</span>
					</div>
					<p className={`text-sm font-bold ${getTextColor(theme)}`}>
						{Number.parseInt(data.totalVideos).toLocaleString()}
					</p>
				</div>

				<div className={`p-3 rounded-lg border ${getBorderColor(theme)} bg-content`}>
					<div className="flex items-center gap-2 mb-1">
						<FiCalendar className="w-4 h-4 text-purple-500" />
						<span className={`text-xs ${getTextColor(theme)} opacity-70`}>عضویت</span>
					</div>
					<p className={`text-xs font-medium ${getTextColor(theme)}`}>
						{formatDate(data.createdAt)}
					</p>
				</div>
			</div>
			{/* Channel Link */}
			<a
				href={`https://youtube.com/channel/${data.id}`}
				target="_blank"
				rel="noopener noreferrer"
				className={`block w-full p-2 text-center text-xs rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors ${getTextColor(theme)} hover:text-red-500`}
			>
				مشاهده کانال در یوتیوب
			</a>{' '}
		</motion.div>
	)
}
