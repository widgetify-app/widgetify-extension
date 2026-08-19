import type React from 'react'
import { useAppearance } from '@/context/appearance.context'

interface WidgetContainerProps {
	children: React.ReactNode
	className?: string
	background?: boolean
	style?: React.CSSProperties
}

export function WidgetContainer({
	children,
	className = '',
	background = true,
	style,
}: WidgetContainerProps) {
	const { canvasMode } = useAppearance()

	return (
		<div className={`widget-outer relative h-full w-full overflow-hidden ${className}`}>
			<div
				className={`widget-content h-full w-full m-auto flex flex-col overflow-hidden ${background ? 'bg-content bg-glass p-2 rounded-widget' : ''} ${canvasMode === 'edit' ? 'pointer-events-none select-none' : ''}`}
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
