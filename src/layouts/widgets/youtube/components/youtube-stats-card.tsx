import { useContrastTextColor } from '@/hooks/useContrastTextColor'
import { useGetImageMainColor } from '@/hooks/useGetImageMainColor'
import type { FetchedYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiEye, FiUsers } from 'react-icons/fi'

interface YouTubeStatsCardProps {
	subscriptionStyle?: 'short' | 'long'
	username: string
	data: FetchedYouTubeProfile & { isCached?: boolean }
}

export function YouTubeStatsCard({
	data,
	username,
	subscriptionStyle = 'short',
}: YouTubeStatsCardProps) {
	const profileMainColor = useGetImageMainColor(data?.profile)
	const nameSpanRef = useRef<HTMLSpanElement>(null)
	const usernameSpanRef = useRef<HTMLSpanElement>(null)
	const textColor = useContrastTextColor(profileMainColor)
	const [nameWidth, setNameWidth] = useState(0)
	const [usernameWidth, setUsernameWidth] = useState(0)

	useEffect(() => {
		if (nameSpanRef.current) {
			setNameWidth(nameSpanRef.current.offsetWidth)
		}
		if (usernameSpanRef.current) {
			setUsernameWidth(usernameSpanRef.current.offsetWidth)
		}
	}, [data.name, username])

	const nameStyle = useMemo(
		() => ({
			marginLeft: nameWidth
				? `-${nameWidth * 2 - 62}px`
				: `-${data.name.length * 1.75 * 4}px`,
			color: textColor,
		}),
		[nameWidth, textColor, data.name]
	)

	const usernameStyle = useMemo(
		() => ({
			marginLeft: usernameWidth
				? `-${usernameWidth * 2 - 63}px`
				: `-${username.length * 1.75 * 4}px`,
			color: textColor,
		}),
		[usernameWidth, textColor, username]
	)

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

	return (
		<div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 overflow-hidden">
			{/* Channel Info */}
			<div
				className="relative p-2 flex items-center gap-3 rounded-xl overflow-hidden shadow-inner"
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

				<div className="absolute py-2 flex flex-col justify-center top-1/2 -translate-y-1/2 inset-x-0">
					<p
						className="flex gap-x-0.5 font-medium text-xs uppercase"
						style={{
							marginLeft: '-2.5rem',
							paddingLeft: '0.5rem',
							color: textColor,
						}}
					>
						{[...new Array(20)].map((_, index) => (
							<span key={index} className="opacity-10 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
					<p
						className="flex gap-x-0.5 font-medium text-xs uppercase"
						style={{
							marginLeft: '-0.5rem',
							paddingLeft: '0.5rem',
							color: textColor,
						}}
					>
						{[...new Array(20)].map((_, index) => (
							<span key={index} className="opacity-10 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
					<p
						className="flex gap-x-0.5 font-medium text-sm uppercase"
						style={nameStyle}
					>
						{[...new Array(20)].map((_, index) => (
							<span
								key={index}
								className={`block w-fit text-nowrap ${
									index === 2 ? 'opacity-90' : 'opacity-10'
								}`}
								ref={index === 1 ? nameSpanRef : undefined}
							>
								{data.name}
							</span>
						))}
					</p>
					<p
						className="flex gap-x-0.5 font-medium text-xs uppercase"
						style={usernameStyle}
					>
						{[...new Array(20)].map((_, index) => (
							<span
								key={index}
								className={`flex items-center gap-x-[0.5px] w-fit text-nowrap ${
									index === 2 ? 'opacity-75' : 'opacity-10'
								}`}
								ref={index === 1 ? usernameSpanRef : undefined}
							>
								<span>{username}</span>
							</span>
						))}
					</p>
					<p
						className="flex gap-x-0.5 font-medium text-xs uppercase"
						style={{
							marginLeft: '-2rem',
							paddingLeft: '0.75rem',
							color: textColor,
						}}
					>
						{[...new Array(20)].map((_, index) => (
							<span key={index} className="opacity-10 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
					<p
						className="flex gap-x-0.5 font-medium text-xs uppercase"
						style={{
							marginLeft: '-2rem',
							paddingLeft: '0.75rem',
							color: textColor,
						}}
					>
						{[...new Array(20)].map((_, index) => (
							<span key={index} className="opacity-10 text-nowrap">
								{data.name}
							</span>
						))}
					</p>
				</div>

				<div className="absolute inset-0 shadow-inner" />
			</div>

			<div className="p-1 flex items-center justify-between gap-x-2 border border-content rounded-xl">
				<div className="w-full px-2 py-1 bg-base-300/75 flex items-center justify-between gap-x-2 rounded-lg">
					<div className="flex items-center gap-1.5">
						<FiUsers className="w-3.5 h-3.5 text-red-500" />
						<span className="text-[10px] text-content opacity-70">مشترک</span>
					</div>

					<p className="text-xs font-medium text-content">
						{formatNumber(data.subscribers, subscriptionStyle)}
					</p>
				</div>
				<div className="w-full px-2 py-1 bg-base-300/75 flex items-center justify-between gap-x-2 rounded-lg">
					<div className="flex items-center gap-1.5">
						<FiEye className="w-3.5 h-3.5 text-blue-500" />
						<span className="text-[10px] text-content opacity-70">
							بازدید
						</span>
					</div>

					<p className="text-xs font-medium text-content">
						{formatNumber(data.totalViews)}
					</p>
				</div>
			</div>

			<div className="w-full h-36 overflow-y-auto space-y-2">
				<div className="w-full h-32 bg-base-300 rounded-xl" />
				<div className="w-full h-32 bg-base-300 rounded-xl" />
			</div>
		</div>
	)
}
