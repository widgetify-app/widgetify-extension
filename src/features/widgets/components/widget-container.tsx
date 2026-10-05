import type React from 'react'
import { cn } from '@/common/utils/cn'
import { useAppearance } from '@/context/appearance.context'

interface WidgetContainerProps {
	children: React.ReactNode
	className?: string
	contentClassName?: string
	background?: boolean
	padding?: boolean
	style?: React.CSSProperties
}

export function WidgetContainer({
	children,
	className = '',
	contentClassName = '',
	background = true,
	padding = true,
	style,
}: WidgetContainerProps) {
	const { canvasMode } = useAppearance()

	return (
		<div
			data-tour="widget"
			className={`relative h-full w-full overflow-hidden ${className}`}
		>
			<div
				className={cn(
					'h-full w-full m-auto flex flex-col overflow-hidden',
					background && 'bg-glass-surface rounded-widget',
					background && (padding ? 'p-2' : 'p-0'),
					contentClassName,
					canvasMode === 'edit' && 'pointer-events-none select-none'
				)}
				inert={canvasMode === 'edit' ? true : undefined}
				style={{
					containerType: 'size',
					containerName: 'widget',
					...style,
				}}
			>
				{children}
			</div>
		</div>
	)
}
