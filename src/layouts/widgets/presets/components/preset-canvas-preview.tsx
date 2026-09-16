import type React from 'react'
import { useMemo } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { WIDGET_DEFINITIONS } from '../../widget-registry'
import type { PresetLayout } from '../types'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'

const PREVIEW_ROWS = 6
const PREVIEW_COLS = 8

function getIconSize(cellCount: number): number {
	if (cellCount >= 6) return 20
	if (cellCount >= 4) return 17
	if (cellCount >= 2) return 14
	return 12
}

interface PresetCanvasPreviewProps {
	preset: PresetLayout
	className?: string
}

export const PresetCanvasPreview: React.FC<PresetCanvasPreviewProps> = ({
	preset,
	className,
}) => {
	const resolvedWidgets = useMemo(
		() => resolvePresetWidgetsForViewport(preset, PREVIEW_ROWS),
		[preset]
	)

	const rows = useMemo(
		() =>
			Math.max(
				PREVIEW_ROWS,
				...resolvedWidgets.map((widget) => widget.position.row + widget.size.h)
			),
		[resolvedWidgets]
	)

	return (
		<div
			dir="ltr"
			aria-hidden="true"
			className={cn(
				'w-full h-36 p-2 overflow-hidden select-none rounded-xl bg-base-content/5 border border-base-content/10 transition-ui',
				className
			)}
		>
			<div
				className="grid w-full h-full gap-[3px]"
				style={{
					gridTemplateColumns: `repeat(${PREVIEW_COLS}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
				}}
			>
				{resolvedWidgets.map((widget) => {
					const definition = WIDGET_DEFINITIONS[widget.id]
					if (!definition) return null

					return (
						<div
							key={widget.instanceId}
							style={{
								gridColumnStart: widget.position.col + 1,
								gridColumnEnd: widget.position.col + widget.size.w + 1,
								gridRowStart: widget.position.row + 1,
								gridRowEnd: widget.position.row + widget.size.h + 1,
							}}
							className="flex items-center justify-center overflow-hidden rounded-md bg-base-content/10 text-muted group-hover:bg-primary/10 group-hover:text-primary transition-ui"
						>
							<Icon
								name={definition.icon}
								size={getIconSize(widget.size.w * widget.size.h)}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}
