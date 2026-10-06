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

interface WidgetCenteredHeaderProps {
	title: ReactNode
}

export function WidgetCenteredHeader({ title }: WidgetCenteredHeaderProps) {
	return (
		<header className="grid items-center flex-none grid-cols-1 h-7">
			<h3 className="col-start-1 row-start-1 text-xs font-bold text-center truncate widget-info text-fg-strong">
				{title}
			</h3>
			<div className="flex col-start-1 row-start-1 justify-self-end widget-control">
				<WidgetMenuButton />
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

interface WidgetHeaderTabsProps<T extends string> {
	label: string
	tabs: { id: T; label: string }[]
	activeTab: T
	onChange: (tab: T) => void
}

export function WidgetHeaderTabs<T extends string>({
	label,
	tabs,
	activeTab,
	onChange,
}: WidgetHeaderTabsProps<T>) {
	return (
		<div
			role="tablist"
			aria-label={label}
			className="flex items-center h-7 min-w-0 gap-3.5 overflow-x-auto scrollbar-none"
		>
			{tabs.map((tab) => {
				const isActive = tab.id === activeTab
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(tab.id)}
						className={cn(
							'relative h-7 text-xs whitespace-nowrap cursor-pointer transition-ui focus-visible:focus-ring',
							isActive
								? 'font-bold text-fg-strong after:absolute after:inset-x-0 after:bottom-px after:h-0.5 after:rounded-xs after:bg-brand'
								: 'font-semibold text-fg-faint hover:text-fg'
						)}
					>
						{tab.label}
					</button>
				)
			})}
		</div>
	)
}

interface WidgetBackButtonProps {
	label: string
	onClick: () => void
}

export function WidgetBackButton({ label, onClick }: WidgetBackButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="grid w-6 rounded-lg cursor-pointer h-7 -ms-1 place-items-center text-fg-muted transition-ui hover:text-fg-strong focus-visible:focus-ring"
		>
			<Icon name="chevronRight" size={16} aria-hidden="true" />
		</button>
	)
}
