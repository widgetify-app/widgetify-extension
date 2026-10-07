import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { type TileVariantProps, tileMediaVariants, tileVariants } from './tile.variants'

interface TileProps extends TileVariantProps {
	media: ReactNode
	onClick: () => void
	title?: ReactNode
	meta?: ReactNode
	overlay?: ReactNode
	actions?: ReactNode
	label?: string
	bare?: boolean
	className?: string
}

export function Tile({
	media,
	onClick,
	title,
	meta,
	overlay,
	actions,
	label,
	bare,
	selected,
	aspect,
	className,
}: TileProps) {
	return (
		<div className={cn(tileVariants({ selected }), className)}>
			<button
				type="button"
				onClick={onClick}
				aria-pressed={selected ?? undefined}
				aria-label={label}
				className="flex flex-col w-full cursor-pointer text-start rounded-2xl focus-visible:focus-ring active:scale-98 transition-ui"
			>
				<span className={tileMediaVariants({ aspect })}>
					{media}
					{overlay}
				</span>
				{!bare && (title || meta) && (
					<span className="flex items-center justify-between w-full min-w-0 gap-2 px-3 py-2.5">
						<span className="text-xs font-semibold truncate text-fg-strong">
							{title}
						</span>
						{meta && <span className="shrink-0">{meta}</span>}
					</span>
				)}
			</button>
			{actions && (
				<div className="absolute flex gap-1 opacity-0 top-2 end-2 transition-ui group-hover:opacity-100 focus-within:opacity-100">
					{actions}
				</div>
			)}
		</div>
	)
}
