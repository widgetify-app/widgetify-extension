import type React from 'react'
import { memo, useRef } from 'react'
import { cn } from '@/common/utils/cn'
import { useContainerSize } from '@/hooks/use-container-size'
import { getDotGridLayout } from '../utils/get-dot-grid-layout'

interface DotGridProps {
	totalDays: number
	passedDays: number
	label: string
}

function getDotClassName(index: number, passedDays: number): string {
	if (index < passedDays) return 'bg-fg-muted'
	if (index === passedDays) return 'ring-[1.5px] ring-brand'
	return 'bg-fill-3'
}

function DotGridImpl({ totalDays, passedDays, label }: DotGridProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const { width, height } = useContainerSize(containerRef)
	const layout = getDotGridLayout(totalDays, width, height)

	return (
		<div
			ref={containerRef}
			role="img"
			aria-label={label}
			className="flex items-center justify-center flex-1 w-full min-h-0"
		>
			{layout && (
				<div
					className="grid content-center justify-center"
					style={
						{
							gridTemplateColumns: `repeat(${layout.columns}, ${layout.cellSize}px)`,
							gridAutoRows: `${layout.cellSize}px`,
							'--dot-size': `${layout.dotSize}px`,
						} as React.CSSProperties
					}
				>
					{Array.from({ length: totalDays }, (_, index) => (
						<span
							key={index}
							className={cn(
								'size-(--dot-size) place-self-center rounded-full transition-colors duration-500',
								getDotClassName(index, passedDays)
							)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export const DotGrid = memo(DotGridImpl)
