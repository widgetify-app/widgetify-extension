import type React from 'react'
import { useMemo } from 'react'
import { cn } from '@/common/utils/cn'
import { WIDGET_DEFINITIONS } from '../../widget-registry'
import type { PresetLayout } from '../types'
import { resolvePresetWidgetsForViewport } from '../utils'

interface PresetCanvasPreviewProps {
	preset: PresetLayout
	className?: string
	isCompact?: boolean
}

export const PresetCanvasPreview: React.FC<PresetCanvasPreviewProps> = ({
	preset,
	className,
	isCompact = false,
}) => {
	const PREVIEW_ROWS = 6
	const resolvedWidgets = useMemo(() => {
		return resolvePresetWidgetsForViewport(preset, PREVIEW_ROWS)
	}, [preset])

	const maxRow = useMemo(() => {
		const rows = resolvedWidgets.map((w) => w.position.row + w.size.h)
		return Math.max(...rows, PREVIEW_ROWS)
	}, [resolvedWidgets])

	const cols = 8

	return (
		<div
			dir="ltr"
			className={cn(
				'relative w-full rounded-2xl bg-base-300/30 border border-base-content/10 p-2 select-none overflow-hidden transition-all',
				isCompact ? 'h-32' : 'h-56 sm:h-64',
				className
			)}
		>
			<div
				className="relative w-full h-full"
				style={{
					direction: 'ltr',
					display: 'grid',
					gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${maxRow}, minmax(0, 1fr))`,
					gap: isCompact ? '3px' : '6px',
				}}
			>
				{resolvedWidgets.map((widget) => {
					const def =
						WIDGET_DEFINITIONS[widget.id as keyof typeof WIDGET_DEFINITIONS]
					const emoji = def?.emoji || '📦'
					const label = def?.label || widget.id

					return (
						<div
							key={widget.instanceId}
							style={{
								gridColumnStart: widget.position.col + 1,
								gridColumnEnd: widget.position.col + widget.size.w + 1,
								gridRowStart: widget.position.row + 1,
								gridRowEnd: widget.position.row + widget.size.h + 1,
							}}
							className={cn(
								'flex flex-col items-center justify-center rounded-xl bg-base-100/70 border border-base-content/15 shadow-xs overflow-hidden transition-all',
								isCompact ? 'p-0.5' : 'p-1.5'
							)}
						>
							<span
								className={cn(
									'leading-none',
									isCompact ? 'text-xs' : 'text-base sm:text-lg mb-0.5'
								)}
							>
								{emoji}
							</span>
							{!isCompact && (
								<span className="text-[10px] sm:text-[11px] font-bold text-content text-center truncate max-w-full px-1">
									{label}
								</span>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
