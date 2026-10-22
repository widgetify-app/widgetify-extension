import type React from 'react'
import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import { cn } from '@/common/utils/cn'
import { gradientBackground } from '@/common/utils/wallpaper-background'
import { Icon, type IconSize } from '@/icons'
import { getWidgetRegistry } from '../registry'
import type { StoredWidget } from '../utils/layout-engine/types'

export const LAYOUT_PREVIEW_ROWS = 6
const PREVIEW_COLS = 8

function getIconSize(cellCount: number): IconSize {
	if (cellCount >= 6) return 20
	if (cellCount >= 4) return 16
	if (cellCount >= 2) return 14
	return 12
}

function wallpaperStyle(
	wallpaper: StoredWallpaper | null
): React.CSSProperties | undefined {
	if (wallpaper?.type === 'IMAGE' && wallpaper.src) {
		return {
			backgroundImage: `url("${wallpaper.src}")`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}
	}
	if (wallpaper?.type === 'GRADIENT' && wallpaper.gradient) {
		return { backgroundImage: gradientBackground(wallpaper.gradient) }
	}
	return undefined
}

interface LayoutPreviewProps {
	widgets: StoredWidget[]
	wallpaper?: StoredWallpaper | null
	className?: string
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({
	widgets,
	wallpaper = null,
	className,
}) => {
	const background = wallpaperStyle(wallpaper)
	const rows = Math.max(
		LAYOUT_PREVIEW_ROWS,
		...widgets.map((widget) => widget.position.row + widget.size.h)
	)

	return (
		<div
			dir="ltr"
			aria-hidden="true"
			className={cn(
				'w-full h-36 p-2 overflow-hidden select-none rounded-xl bg-fill border border-line transition-ui',
				className
			)}
			style={background}
		>
			<div
				className="grid w-full h-full gap-[3px]"
				style={{
					gridTemplateColumns: `repeat(${PREVIEW_COLS}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
				}}
			>
				{widgets.map((widget) => {
					const definition = getWidgetRegistry()[widget.id]
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
							className={cn(
								'flex items-center justify-center overflow-hidden rounded-lg transition-ui',
								background
									? 'bg-glass-surface-2 backdrop-blur-sm text-fg'
									: 'bg-fill-2 text-fg-muted group-hover:bg-brand-fill group-hover:text-brand'
							)}
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
