import type { MouseEvent, ReactNode } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface NotificationCardProps {
	children: ReactNode
	isInteractive?: boolean
	className?: string
}

export function NotificationCard({
	children,
	isInteractive,
	className,
}: NotificationCardProps) {
	return (
		<div
			className={cn(
				'relative flex gap-3 p-3 border rounded-2xl border-line transition-ui',
				isInteractive && 'cursor-pointer hover:bg-fill active:scale-[0.99]',
				className
			)}
		>
			{children}
		</div>
	)
}

interface NotificationCloseButtonProps {
	onClick: (event: MouseEvent) => void
}

export function NotificationCloseButton({ onClick }: NotificationCloseButtonProps) {
	return (
		<button
			type="button"
			aria-label={t('navbar.notifications.close')}
			onClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
				onClick(event)
			}}
			className="relative z-10 grid self-start rounded-lg cursor-pointer shrink-0 size-6 place-items-center bg-fill text-fg-faint transition-ui hover:bg-danger-fill hover:text-danger focus-visible:focus-ring"
		>
			<Icon name="close" size={14} aria-hidden="true" />
		</button>
	)
}
