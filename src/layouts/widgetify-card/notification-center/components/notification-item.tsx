import { callEvent } from '@/common/utils/call-event'
import type { NotificationItem } from '@/services/hooks/extension/getWigiPadData.hook'
import { HiChevronDown, HiXMark } from 'react-icons/hi2' // آیکون مدرن‌تر
import { useState } from 'react'
import Analytics from '@/analytics'

interface NotificationItemProps extends NotificationItem {
	onClose(e: any, id: string): any
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
			callEvent('go_to_page', goTo)
			Analytics.event('notifications_page')
		} else if (type === 'action' && target) {
			callEvent(target as any)
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
	const { link, icon, title, closeable, id, onClose, description, target, goTo, type } =
		prop

	const [isExpanded, setIsExpanded] = useState(false)
	const CHARACTER_LIMIT = 85

	const toggleExpand = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsExpanded(!isExpanded)
		Analytics.event('notifications_toggle_expand')
	}

	const shouldShowReadMore = description && description.length > CHARACTER_LIMIT

	return (
		<Wrapper
			link={link}
			target={target}
			type={type}
			goTo={goTo}
			className={`flex gap-2 p-2 transition-all duration-300 border rounded-xl ${link && 'cursor-pointer'} bg-base-300/70 hover:bg-base-300 border-base-300/70 active:scale-[0.99] group relative hover:scale-[0.99]`}
		>
			{icon && (
				<div className="flex-shrink-0">
					<div className="p-1.5 bg-base-content/5 rounded-lg">
						<img src={icon} alt="icon" className="object-contain w-4 h-4" />
					</div>
				</div>
			)}

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<h4 className="text-[13px] font-black tracking-tight text-base-content/90 truncate">
						{title}
					</h4>
				</div>

				{description && (
					<div className="relative">
						<p
							className={`mt-1 text-[11px] font-medium text-base-content/60 leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${!isExpanded && shouldShowReadMore ? 'line-clamp-2' : ''}`}
						>
							{description}
						</p>

						{shouldShowReadMore && (
							<button
								onClick={toggleExpand}
								className="mt-1 flex items-center gap-1 text-[10px] font-light text-muted hover:underline cursor-pointer"
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
			</div>

			{closeable && id && (
				<button
					type="button"
					className="absolute p-1 transition-opacity rounded-md opacity-0 cursor-pointer top-2 left-2 bg-base-content/5 text-base-content/40 group-hover:opacity-100 hover:bg-error/10 hover:text-error"
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						onClose(e, id)
					}}
				>
					<HiXMark size={14} />
				</button>
			)}
		</Wrapper>
	)
}
