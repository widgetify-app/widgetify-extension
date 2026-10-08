import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { t } from '@/common/i18n'

interface Prop {
	className: string
}
export function ProfileProgressNotification({ className }: Prop) {
	const { profilePercentage } = useAuth()
	const onRemoveNotif = () => {
		callEvent('remove_from_notifications', { id: 'update_profile', ttl: 240 })
		Analytics.event('profile_progressbar_remove')
	}

	const onClick = () => {
		callEvent('openSettings', 'profile')
		Analytics.event('profile_progressbar_click')
	}

	return (
		<div
			className={`flex w-full gap-2 px-2 py-1 transition-ui duration-300 border rounded-xl  border-surface-3 hover:scale-[0.99] active:scale-[0.99] ${className}`}
		>
			<button
				type="button"
				onClick={onClick}
				className="flex flex-row items-center w-full gap-2 text-start cursor-pointer rounded-xl focus-visible:focus-ring"
			>
				<RadialProgressSmall percentage={profilePercentage} size={15} />
				<p className="text-2xs w-fit font-normal text-fg-muted">
					{t('navbar.notifications.completeProfile')}
				</p>
			</button>
			<div className="flex items-start justify-between">
				<button
					type="button"
					aria-label={t('navbar.notifications.close')}
					className="flex p-0.5 transition-opacity rounded-lg cursor-pointer top-2 left-2 bg-fill text-fg-faint hover:bg-danger-fill hover:text-danger"
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						onRemoveNotif()
					}}
				>
					<Icon name="close" size={14} />
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
				aria-hidden="true"
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
					// className="stroke-brand"
					className="stroke-line"
					strokeWidth={strokeWidth}
				/>
				{/* Progress Circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					className="transition-[stroke-dashoffset] duration-500 ease-out stroke-fg-faint"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
			</svg>
			{/* Small Percentage Text */}
			<span className="absolute text-xs font-bold text-fg-faint">
				{safePercentage}%
			</span>
		</div>
	)
}
