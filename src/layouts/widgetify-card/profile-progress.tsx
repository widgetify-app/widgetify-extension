import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { HiXMark } from 'react-icons/hi2'

export function ProfileProgressNotification() {
	const { profilePercentage } = useAuth()
	const onRemoveNotif = () => {
		callEvent('remove_from_notifications', { id: 'update_profile', ttl: 240 })
		Analytics.event('profile_progressbar_remove')
	}

	const onClick = () => {
		callEvent('openProfile')
		Analytics.event('profile_progressbar_click')
	}

	return (
		<div
			className="flex w-full gap-2 px-2 py-1 transition-all duration-300 border cursor-pointer rounded-xl bg-base-300/70 border-base-300/70 hover:scale-[0.99] active:scale-[0.99]"
			id="update_profile"
			onClick={() => onClick()}
		>
			<div className="flex flex-row items-center w-full gap-2 rounded-xl ">
				<RadialProgressSmall percentage={profilePercentage} size={15} />
				<p className="text-[11px] w-fit font-normal text-base-content/60">
					پروفایلت رو کامل کن و پاداش بگیر!
				</p>
			</div>
			<div className="flex items-start justify-between">
				<button
					type="button"
					className="flex p-0.5 transition-opacity rounded-md cursor-pointer top-2 left-2 bg-base-content/5 text-base-content/40 hover:bg-error/10 hover:text-error"
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						onRemoveNotif()
					}}
				>
					<HiXMark size={14} />
				</button>
			</div>
		</div>
	)
}

const RadialProgressSmall = ({ percentage }: any) => {
	const size = 40
	const strokeWidth = 5

	const safePercentage = Math.max(0, Math.min(100, percentage))
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const offset = circumference - (safePercentage / 100) * circumference

	return (
		<div
			className="relative flex items-center justify-center"
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
			>
				{/* Background Circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					// className="stroke-blue-100"
					className="stroke-base-content/10"
					strokeWidth={strokeWidth}
				/>
				{/* Progress Circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					className="transition-all duration-500 ease-out stroke-base-content/40"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
			</svg>
			{/* Small Percentage Text */}
			<span className="absolute text-xs font-bold text-base-content/50">
				{safePercentage}%
			</span>
		</div>
	)
}
