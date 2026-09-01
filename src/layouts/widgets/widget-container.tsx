import type React from 'react'
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
			className={`widget-outer relative h-full w-full overflow-hidden rounded-widget ${className}`}
		>
			<div
				className={`h-full w-full m-auto flex flex-col overflow-hidden ${background ? `bg-content bg-glass ${padding ? 'p-2' : 'p-0'} rounded-widget` : ''} ${contentClassName} ${canvasMode === 'edit' ? 'pointer-events-none select-none' : ''}`}
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
