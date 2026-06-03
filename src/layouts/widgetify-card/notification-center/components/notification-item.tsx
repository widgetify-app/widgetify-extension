import { callEvent } from '@/common/utils/call-event'
import { HiChevronDown, HiXMark } from 'react-icons/hi2'
import { useState } from 'react'
import Analytics from '@/analytics'
import type { NotificationItem } from '@/services/hooks/extension/getNotifications.hook'

interface NotificationItemProps {
	onClose(e: any, id: string): any
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
	const CHARACTER_LIMIT = 85

	const toggleExpand = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsExpanded(!isExpanded)
		Analytics.event('notifications_toggle_expand')
	}

	const shouldShowReadMore = description && description.length > CHARACTER_LIMIT
	const isText = type === 'text'

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
		<Wrapper
			link={link}
			target={target}
			type={type}
			goTo={goTo}
			className={`flex gap-2 p-2 transition-all duration-300 border rounded-xl ${!isText && 'hover:scale-[0.99] hover:bg-base-300  items-center active:scale-[0.99]'} ${link && 'cursor-pointer'}   border-base-300/70 group relative`}
		>
			{icon && (
				<div className="shrink-0 self-start mt-0.5">
					<div className="p-1 rounded-lg bg-base-content/5">
						{icon.startsWith('http') ? (
							<img
								src={icon}
								alt="icon"
								className="object-contain w-3 h-3 rounded"
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
						className="text-[13px] font-black tracking-tight text-base-content/90"
						style={headTitleStyle}
					>
						{title}
					</h4>
				</div>

				{description && (
					<div className="relative">
						<p
							className={`mt-1 text-[10px] font-medium text-base-content/60 leading-relaxed whitespace-pre-wrap wrap-break-word transition-all duration-300 ${!isExpanded && shouldShowReadMore ? 'line-clamp-2' : ''}`}
						>
							{description}
						</p>

						{shouldShowReadMore && (
							<button
								onClick={toggleExpand}
								className="mt-1 flex items-center gap-1 border border-base-content/4 rounded-xl px-1 hover:border-base-content/10 text-[10px] font-light text-muted hover:underline cursor-pointer"
							>
								{isExpanded ? 'نمایش کمتر' : 'مشاهده بیشتر'}
								<HiChevronDown
									className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
									size={12}
								/>
							</button>
						)}
					</div>
				)}

				{formattedJalaliDate && (
					<div className="flex justify-start mt-0.5">
						<span className="text-[10px] font-light text-base-content/40">
							{formattedJalaliDate}
						</span>
					</div>
				)}
			</div>

			{closeable && id && (
				<button
					type="button"
					className="flex p-0.5 transition-opacity  self-start rounded-md cursor-pointer top-2 left-2 bg-base-content/5 text-base-content/40 hover:bg-error/10 hover:text-error"
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						prop?.onClose(e, id)
					}}
				>
					<HiXMark size={14} />
				</button>
			)}
		</Wrapper>
	)
}
