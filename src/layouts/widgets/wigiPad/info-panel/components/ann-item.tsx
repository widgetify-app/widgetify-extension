import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { callEvent } from '@/common/utils/call-event'
import type { NotificationItem } from '@/services/hooks/extension/getNotifications.hook'

interface NotificationItemProps {
	notification: NotificationItem
}

interface Prop {
	link: string | undefined
	className: string
	children: React.ReactNode
	type: NotificationItem['type']
	target: NotificationItem['target']
	goTo: NotificationItem['goTo']
}

function Wrapper({ link, children, className, type, goTo, target }: Prop) {
	const isClickable = !!link || ['page', 'action'].includes(type || '---')

	const handleClick = () => {
		if (type === 'page' && goTo) {
			callEvent('go_to_page', goTo as any)
			Analytics.event('notifications_page')
		} else if (type === 'action') {
			callEvent(goTo as any, target as any)
			Analytics.event('notifications_action')
		}
	}

	if (link) {
		return (
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				className={className}
			>
				{children}
			</a>
		)
	}

	return (
		<div
			className={`${className} ${isClickable ? 'cursor-pointer' : ''}`}
			onClick={handleClick}
		>
			{children}
		</div>
	)
}

export function RenderWigiPadItem({ notification }: NotificationItemProps) {
	const clickable = notification.link || notification.type !== 'text'

	const containerStyle: React.CSSProperties = {
		backgroundColor: notification.backgroundColor || undefined,
		borderRadius: notification.borderRadius || undefined,
	}

	const titleStyle: React.CSSProperties = {
		color:
			notification.titleColor || notification.backgroundColor
				? getContrastingTextColor(notification.backgroundColor || '')
				: undefined,
		textDecoration: notification.titleDecoration,
	}

	if (notification.type === 'banner') {
		return (
			<Wrapper
				link={notification.link}
				target={notification.target}
				type={notification.type}
				goTo={notification.goTo}
				className=""
			>
				<div
					className="w-full rounded max-h-24 min-h-24"
					style={{
						height: notification.hight,
						backgroundImage: `url('${notification.icon}')`,
						backgroundPosition: 'bottom',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					}}
				></div>
			</Wrapper>
		)
	}

	return (
		<Wrapper
			link={notification.link}
			target={notification.target}
			type={notification.type}
			goTo={notification.goTo}
			className=""
		>
			<div
				className={`
        group relative flex items-center gap-1 w-fit px-1 py-0.5 ${notification.hasBorder && 'border border-content'}  ${clickable ? 'transition-all duration-150 active:scale-95' : ''}
      `}
				style={containerStyle}
			>
				{notification.icon && (
					<div className="flex items-center justify-center w-6 h-6 text-lg rounded shrink-0">
						{notification?.icon.startsWith('http') ||
						notification?.icon.startsWith('/') ? (
							<img
								src={notification.icon}
								alt=""
								className="object-contain w-5 h-5 rounded "
							/>
						) : (
							<span>{notification.icon}</span>
						)}
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div
						className="text-xs font-semibold leading-tight line-clamp-1 text-base-content/90"
						style={titleStyle}
					>
						{notification.title}
					</div>

					{notification.description && (
						<div className="mt-0.5 text-[8px] font-medium leading-snug text-base-content/70">
							{notification.description}
						</div>
					)}
				</div>
			</div>
		</Wrapper>
	)
}
