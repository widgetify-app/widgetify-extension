import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { t } from '@/common/i18n'
import { NotificationCard, NotificationCloseButton } from './notification-card'

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
		<NotificationCard isInteractive className={className}>
			<button
				type="button"
				onClick={onClick}
				className="flex items-center flex-1 min-w-0 gap-3 rounded-xl cursor-pointer text-start after:absolute after:inset-0 after:rounded-2xl focus-visible:focus-ring"
			>
				<RadialProgress percentage={profilePercentage} />
				<p className="text-xs font-semibold leading-relaxed text-fg">
					{t('navbar.notifications.completeProfile')}
				</p>
			</button>
			<NotificationCloseButton onClick={onRemoveNotif} />
		</NotificationCard>
	)
}

const RING_SIZE = 40
const RING_STROKE = 4

function RadialProgress({ percentage }: { percentage: number }) {
	const safePercentage = Math.max(0, Math.min(100, percentage))
	const radius = (RING_SIZE - RING_STROKE) / 2
	const circumference = radius * 2 * Math.PI
	const offset = circumference - (safePercentage / 100) * circumference

	return (
		<div
			className="relative grid shrink-0 place-items-center"
			style={{ width: RING_SIZE, height: RING_SIZE }}
		>
			<svg
				aria-hidden="true"
				width={RING_SIZE}
				height={RING_SIZE}
				viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
				className="-rotate-90"
			>
				<circle
					cx={RING_SIZE / 2}
					cy={RING_SIZE / 2}
					r={radius}
					fill="none"
					className="stroke-fill-2"
					strokeWidth={RING_STROKE}
				/>
				<circle
					cx={RING_SIZE / 2}
					cy={RING_SIZE / 2}
					r={radius}
					fill="none"
					className="transition-[stroke-dashoffset] duration-500 ease-out stroke-brand"
					strokeWidth={RING_STROKE}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
			</svg>
			<span className="absolute text-3xs font-bold text-fg">{safePercentage}%</span>
		</div>
	)
}
