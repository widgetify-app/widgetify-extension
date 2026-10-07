import { memo } from 'react'
import { cn } from '@/common/utils/cn'
import { useWallpaperTheme } from '../hooks/use-wallpaper-theme'

interface GridOverlayProps {
	totalGridRows: number
	cols: number
	cellWidth: number
	cellHeight: number
	gap: number
}

function GridOverlayImpl({
	totalGridRows,
	cols,
	cellWidth,
	cellHeight,
	gap,
}: GridOverlayProps) {
	const wallpaper = useWallpaperTheme()

	if (cellWidth <= 0 || cellHeight <= 0) return null

	const inkStyle = wallpaper.isDerivedFromWallpaper
		? {
				borderColor: `hsla(${wallpaper.inkHsl}, 0.4)`,
				backgroundColor: `hsla(${wallpaper.inkHsl}, 0.1)`,
			}
		: undefined

	return (
		<div
			className="absolute inset-0 overflow-hidden pointer-events-none rounded-widget"
			style={{
				gap: `${gap}px`,
			}}
		>
			{Array.from({ length: totalGridRows }).map((_, r) => (
				<div
					key={r}
					className="absolute flex w-full"
					style={{
						top: `${r * (cellHeight + gap)}px`,
						height: `${cellHeight}px`,
						left: 0,
						gap: `${gap}px`,
					}}
				>
					{Array.from({ length: cols }).map((_, c) => (
						<div
							key={c}
							style={{
								width: `${cellWidth}px`,
								height: `${cellHeight}px`,
								...inkStyle,
							}}
							className={cn(
								'border border-dashed rounded-widget',
								!inkStyle && 'border-line bg-fill'
							)}
						/>
					))}
				</div>
			))}
		</div>
	)
}

export const GridOverlay = memo(GridOverlayImpl)
