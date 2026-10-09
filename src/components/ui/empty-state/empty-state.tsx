import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'
import { EmptyArt, type EmptyArtName, isEmptyArtName } from '../empty-art/empty-art'

interface EmptyStateProps {
	icon: IconName | EmptyArtName
	title: string
	description?: string
	action?: ReactNode
	className?: string
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-3 py-12 text-center',
				className
			)}
		>
			{isEmptyArtName(icon) ? (
				<EmptyArt name={icon} className="size-16" />
			) : (
				<span className="grid size-12 place-items-center rounded-2xl bg-fill-2 text-fg-faint">
					<Icon name={icon} size={20} />
				</span>
			)}
			<div className="space-y-1">
				<p className="text-sm font-semibold text-fg">{title}</p>
				{description && <p className="text-xs text-fg-muted">{description}</p>}
			</div>
			{action}
		</div>
	)
}
