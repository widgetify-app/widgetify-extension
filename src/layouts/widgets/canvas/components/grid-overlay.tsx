import { memo } from 'react'

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
	if (cellWidth <= 0 || cellHeight <= 0) return null

	return (
		<div
			className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl"
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
							}}
							className="border border-dashed rounded-widget border-base-content/25 bg-base-300/10"
						/>
					))}
				</div>
			))}
		</div>
	)
}

export const GridOverlay = memo(GridOverlayImpl)
