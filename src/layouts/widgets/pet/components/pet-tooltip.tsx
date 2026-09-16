import type React from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'

interface PetTooltipProps {
	direction: number
	content: string | ReactNode
	emoji?: string
	isAnimation?: boolean
	placement?: 'top' | 'bottom'
}

export const PetTooltip: React.FC<PetTooltipProps> = ({
	direction,
	content,
	emoji,
	isAnimation = false,
	placement = 'top',
}) => {
	return (
		<div
			className={cn(
				'absolute left-1/2',
				placement === 'top' ? '-top-8' : '-bottom-8',
				isAnimation && 'animate-pet-tooltip-in'
			)}
			style={{ transform: `translateX(-50%) scaleX(${direction})` }}
		>
			<div
				className={cn(
					'relative px-2.5 py-1 rounded-md text-xs whitespace-nowrap elevation-lg border border-neutral-content/20 bg-neutral/90 text-neutral-content',
					'after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-r-[6px] after:border-t-[6px] after:border-l-transparent after:border-r-transparent after:border-t-neutral/90',
					isAnimation && 'animate-pet-tooltip-pulse'
				)}
			>
				<div className="flex items-center gap-1">
					{emoji && (
						<span
							aria-hidden="true"
							className={cn(
								'inline-block',
								isAnimation && 'animate-pet-tooltip-wiggle'
							)}
						>
							{emoji}
						</span>
					)}
					<span className="font-medium">{content}</span>
				</div>
			</div>
		</div>
	)
}
