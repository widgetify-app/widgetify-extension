import { callEvent } from '@/common/utils/call-event'
import { useState } from 'react'
import Analytics from '@/analytics'
import type { NotificationItem } from '@/services/extension/get-notifications.hook'
import { Icon } from '@/icons'
import { t } from '@/common/i18n'
import { NotificationCard, NotificationCloseButton } from './notification-card'

const CHARACTER_LIMIT = 85
interface NotificationItemProps {
	onClose(e: any, id: string): any
	notification: NotificationItem
	className?: string
}

export function NotificationCardItem(prop: NotificationItemProps) {
	const {
		link,
		icon,
		title,
		closeable,
		id,
		description,
		target,
		goTo,
		type,
		titleDecoration,
		createdAt,
	} = prop.notification

	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpand = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsExpanded(!isExpanded)
		Analytics.event('notifications_toggle_expand')
	}

	const shouldShowReadMore = description && description.length > CHARACTER_LIMIT
	const isText = type === 'text'
	const isAction = !link && (type === 'page' || type === 'action')

	const handleAction = () => {
		if (type === 'page' && goTo) {
			callEvent('go_to_page', goTo as any)
			Analytics.event('notifications_page')
		} else if (type === 'action') {
			callEvent(goTo as any, target as any)
			Analytics.event('notifications_action')
		}
		callEvent('closeAllDropdowns')
	}

	const headTitleStyle: React.CSSProperties = {
		textDecoration: titleDecoration,
	}

	const formattedJalaliDate = createdAt
		? new Intl.DateTimeFormat('fa-IR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(new Date(createdAt))
		: null

	return (
		<NotificationCard isInteractive={!isText} className={prop.className}>
			{icon && (
				<div className="grid self-start rounded-xl shrink-0 size-9 place-items-center bg-fill">
					{icon.startsWith('http') ? (
						<img
							src={icon}
							alt=""
							className="object-contain rounded-sm size-5"
						/>
					) : (
						<span className="text-lg leading-none">{icon}</span>
					)}
				</div>
			)}

			<div className="flex-1 min-w-0 space-y-1">
				<h4 className="text-sm font-bold text-fg-strong" style={headTitleStyle}>
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className="after:absolute after:inset-0 after:rounded-2xl focus-visible:focus-ring"
						>
							{title}
						</a>
					) : isAction ? (
						<button
							type="button"
							onClick={handleAction}
							className="cursor-pointer text-start after:absolute after:inset-0 after:rounded-2xl focus-visible:focus-ring"
						>
							{title}
						</button>
					) : (
						title
					)}
				</h4>

				{description && (
					<div>
						<p
							className={`text-2xs font-medium text-fg-muted leading-relaxed whitespace-pre-wrap wrap-break-word ${!isExpanded && shouldShowReadMore ? 'line-clamp-2' : ''}`}
						>
							{description}
						</p>

						{shouldShowReadMore && (
							<button
								type="button"
								onClick={toggleExpand}
								className="relative z-10 flex items-center gap-1 mt-1 text-3xs font-medium rounded-lg cursor-pointer text-fg-muted transition-ui hover:text-brand focus-visible:focus-ring"
							>
								{isExpanded
									? t('navbar.notifications.showLess')
									: t('navbar.notifications.showMore')}
								<Icon
									name="chevronDown"
									className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
									size={12}
								/>
							</button>
						)}
					</div>
				)}

				{formattedJalaliDate && (
					<p className="text-3xs text-fg-faint">{formattedJalaliDate}</p>
				)}
			</div>

			{closeable && id && (
				<NotificationCloseButton onClick={(e) => prop.onClose(e, id)} />
			)}
		</NotificationCard>
	)
}
