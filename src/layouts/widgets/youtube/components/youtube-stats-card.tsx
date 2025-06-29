import { useRef } from 'react'

import { useGetImageMainColor } from '@/hooks/useGetImageMainColor'
import type { FetchedYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
import { FiCalendar, FiEye, FiUsers, FiVideo } from 'react-icons/fi'

interface YouTubeStatsCardProps {
	subscriptionStyle?: 'short' | 'long'
	data: FetchedYouTubeProfile & { isCached?: boolean }
}

export function YouTubeStatsCard({
	data,
	subscriptionStyle = 'short',
}: YouTubeStatsCardProps) {
	const profileMainColor = useGetImageMainColor(data?.profile)
	const spanRef = useRef<HTMLSpanElement>(null)

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
		<div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
			{/* Channel Info */}
			<div
				className="relative p-2 flex items-center gap-3 rounded-xl overflow-hidden"
				style={{
					backgroundColor: `${profileMainColor}44`,
					backgroundImage: `url(${data.profile})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
				dir="ltr"
			>
				{/* Blurred background overlay */}
				<div
					className="absolute inset-0 backdrop-blur-lg"
					style={{ backgroundColor: `${profileMainColor}20` }}
				/>
				{/* Content */}
				<div className="relative z-10 flex items-center w-full">
					<img
						src={data.profile}
						alt={data.name}
						className="object-cover w-12 h-12 rounded-lg drop-shadow-lg"
						onError={(e) => {
							e.currentTarget.src =
								'https://via.placeholder.com/48x48/ff0000/ffffff?text=YT'
						}}
					/>
				</div>

				<div className="absolute py-2 flex flex-col justify-between gap-y-[1.5px] inset-0">
					<p
						className={
							'-ml-5 pl-2 flex gap-x-0.5 font-medium text-xs uppercase'
						}
					>
						{[...new Array(10)].map((_, index) => (
							<span key={index} className="opacity-20 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
					<p
						className={'flex gap-x-0.5 font-medium text-xs uppercase'}
						style={{
							marginLeft: spanRef?.current?.offsetWidth
								? `-${spanRef?.current?.offsetWidth * 2 - 62}px`
								: `-${data.name.length * 1.75 * 4}px`,
						}}
					>
						{[...new Array(10)].map((_, index) => (
							<span
								key={index}
								className={`block w-fit text-nowrap ${index === 2 ? 'opacity-80' : 'opacity-20'}`}
								ref={index === 1 ? spanRef : undefined}
							>
								{data.name}
							</span>
						))}
					</p>
					<p
						className={
							'-ml-5 pl-3 flex gap-x-0.5 font-medium text-xs uppercase'
						}
					>
						{[...new Array(10)].map((_, index) => (
							<span key={index} className="opacity-20 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
				</div>
			</div>
			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-2">
				<div className={'p-3 rounded-xl border border-content bg-content'}>
					<div className="flex items-center gap-2 mb-1">
						<FiUsers className="w-4 h-4 text-red-500" />
						<span className={'text-xs text-content opacity-70'}>مشترک</span>
					</div>{' '}
					<p className={'text-sm font-bold text-content'}>
						{formatNumber(data.subscribers, subscriptionStyle)}
					</p>
				</div>

				<div className={'p-3 rounded-xl border border-content bg-content'}>
					<div className="flex items-center gap-2 mb-1">
						<FiEye className="w-4 h-4 text-blue-500" />
						<span className={'text-xs text-content opacity-70'}>بازدید</span>
					</div>
					<p className={'text-sm font-bold text-content'}>
						{formatNumber(data.totalViews)}
					</p>
				</div>

				<div className={'p-3 rounded-xl border border-content bg-content'}>
					<div className="flex items-center gap-2 mb-1">
						<FiVideo className="w-4 h-4 text-green-500" />
						<span className={'text-xs text-content opacity-70'}>ویدیو</span>
					</div>
					<p className={'text-sm font-bold text-content'}>
						{Number.parseInt(data.totalVideos).toLocaleString()}
					</p>
				</div>

				<div className={'p-3 rounded-xl border border-content bg-content'}>
					<div className="flex items-center gap-2 mb-1">
						<FiCalendar className="w-4 h-4 text-purple-500" />
						<span className={'text-xs text-content opacity-70'}>عضویت</span>
					</div>
					<p className={'text-xs font-medium text-content'}>
						{formatDate(data.createdAt)}
					</p>
				</div>
			</div>
			{/* Channel Link */}
			<a
				href={`https://youtube.com/channel/${data.id}`}
				target="_blank"
				rel="noopener noreferrer"
				className={
					'block w-full p-2 text-center text-xs rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-colors text-content hover:text-red-500'
				}
			>
				{' '}
				مشاهده کانال در یوتیوب
			</a>
		</div>
	)
}
