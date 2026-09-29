import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'
import { alertVariants } from './alert.variants'

type AlertTone = 'danger' | 'warning' | 'info'

const TONE_ICONS: Record<AlertTone, IconName> = {
	danger: 'exclamation',
	warning: 'alert',
	info: 'info',
}

interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	tone: AlertTone
	title?: React.ReactNode
	icon?: IconName
	action?: React.ReactNode
}

export function Alert({
	tone,
	title,
	icon,
	action,
	className,
	children,
	...rest
}: AlertProps) {
	return (
		<div
			role={tone === 'danger' ? 'alert' : undefined}
			className={cn(alertVariants({ tone }), className)}
			{...rest}
		>
			<Icon name={icon ?? TONE_ICONS[tone]} size={16} className="shrink-0 mt-0.5" />
			<div className="flex-1 min-w-0">
				{title && <p className="font-bold">{title}</p>}
				{children}
			</div>
			{action && <div className="self-center shrink-0">{action}</div>}
		</div>
	)
}
