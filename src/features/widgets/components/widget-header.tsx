import type { ReactNode, Ref } from 'react'
import { cn } from '@/common/utils/cn'
import { Tooltip } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import {
	controlToneClass,
	type WidgetControlTone,
	WidgetMenuButton,
} from './widget-menu-button'

interface WidgetHeaderProps {
	title: ReactNode
	leading?: ReactNode
	badge?: ReactNode
	info?: ReactNode
	actions?: ReactNode
	tone?: WidgetControlTone
}

export function WidgetHeader({
	title,
	leading,
	badge,
	info,
	actions,
	tone = 'default',
}: WidgetHeaderProps) {
	const isOnColor = tone === 'onColor'
	return (
		<header className="flex items-center flex-none h-7 min-w-0 gap-2">
			{leading}
			<div className="flex items-center flex-1 min-w-0 gap-2">
				{typeof title === 'string' ? (
					<h3
						className={cn(
							'text-xs font-bold truncate',
							isOnColor ? 'text-current' : 'text-fg-strong'
						)}
					>
						{title}
					</h3>
				) : (
					title
				)}
				{badge}
			</div>
			<div className="grid items-center flex-none justify-items-end">
				{info && (
					<span
						className={cn(
							'col-start-1 row-start-1 font-medium widget-info text-3xs whitespace-nowrap',
							isOnColor ? 'text-current opacity-60' : 'text-fg-faint'
						)}
					>
						{info}
					</span>
				)}
				<div className="flex items-center col-start-1 row-start-1 gap-0.5 widget-control">
					{actions}
					<WidgetMenuButton tone={tone} />
				</div>
			</div>
		</header>
	)
}

interface WidgetHeaderButtonProps {
	label: string
	icon: IconName
	onClick: () => void
	isActive?: boolean
	disabled?: boolean
	tone?: WidgetControlTone
	ref?: Ref<HTMLButtonElement>
}

export function WidgetHeaderButton({
	label,
	icon,
	onClick,
	isActive = false,
	disabled = false,
	tone = 'default',
	ref,
}: WidgetHeaderButtonProps) {
	return (
		<Tooltip content={label} delay={500}>
			<button
				ref={ref}
				type="button"
				aria-label={label}
				onClick={onClick}
				disabled={disabled}
				className={cn(
					'grid place-items-center size-7 rounded-lg cursor-pointer transition-ui focus-visible:focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
					controlToneClass(tone, isActive)
				)}
			>
				<Icon name={icon} size={16} aria-hidden="true" />
			</button>
		</Tooltip>
	)
}
