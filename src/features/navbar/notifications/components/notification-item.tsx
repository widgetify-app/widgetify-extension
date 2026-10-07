import { callEvent } from '@/common/utils/call-event'
import { useState } from 'react'
import Analytics from '@/analytics'
import type { NotificationItem } from '@/services/extension/get-notifications.hook'
import { Icon } from '@/icons'
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
		<div
			className={`flex gap-2 p-2 transition-ui duration-300 border rounded-2xl ${!isText && 'hover:scale-[0.99] cursor-pointer hover:bg-surface-3  items-center active:scale-[0.99]'} border-surface-3 group relative ${prop.className || ''}`}
		>
			{icon && (
				<div className="shrink-0 self-start mt-0.5">
					<div className="p-1 rounded-lg bg-fill">
						{icon.startsWith('http') ? (
							<img
								src={icon}
								alt="icon"
								className="object-contain w-3 h-3 rounded-sm"
							/>
						) : (
							<span className="w-4 h-4 text-sm">{icon}</span>
						)}
					</div>
				</div>
			)}

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<h4
						className="text-sm font-black tracking-tight text-fg"
						style={headTitleStyle}
					>
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
								className="text-start cursor-pointer after:absolute after:inset-0 after:rounded-2xl focus-visible:focus-ring"
							>
								{title}
							</button>
						) : (
							title
						)}
					</h4>
				</div>

				{description && (
					<div>
						<p
							className={`mt-0.5 text-4xs font-medium  text-fg-muted  leading-relaxed whitespace-pre-wrap wrap-break-word transition-ui duration-300 ${!isExpanded && shouldShowReadMore ? 'line-clamp-2' : ''}`}
						>
							{description}
						</p>

						{shouldShowReadMore && (
							<button
								type="button"
								onClick={toggleExpand}
								className="relative z-10 mt-1 flex items-center gap-1 border border-line rounded-xl px-1 hover:border-brand-muted text-3xs font-light text-fg-muted hover:underline cursor-pointer"
							>
								{isExpanded ? 'نمایش کمتر' : 'مشاهده بیشتر'}
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
					<div className="flex justify-start mt-0.5">
						<span className="text-3xs font-light text-fg-faint">
							{formattedJalaliDate}
						</span>
					</div>
				)}
			</div>

			{closeable && id && (
				<button
					type="button"
					aria-label="بستن"
					className="relative z-10 flex p-0.5 transition-opacity  self-start rounded-lg cursor-pointer top-2 left-2 bg-fill text-fg-faint hover:bg-danger-fill hover:text-danger"
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						prop?.onClose(e, id)
					}}
				>
					<Icon name="close" size={14} />
				</button>
			)}
		</div>
	)
}
