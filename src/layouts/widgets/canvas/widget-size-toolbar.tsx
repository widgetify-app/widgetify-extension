import type { WidgetSize } from '../layout-engine/types'

interface WidgetSizeToolbarProps {
	allowedSizes: WidgetSize[]
	currentSize: WidgetSize
	cols: number
	onSelectSize: (size: WidgetSize) => void
}

export function WidgetSizeToolbar({
	allowedSizes,
	currentSize,
	cols,
	onSelectSize,
}: WidgetSizeToolbarProps) {
	const fittingSizes = allowedSizes.filter((size) => size.w <= cols)

	if (fittingSizes.length <= 1) {
		return null
	}

	return (
		<div
			dir="ltr"
			className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 flex items-center gap-1 p-1 bg-base-300/95 backdrop-blur-md rounded-xl shadow-xl border border-base-content/10 animate-in fade-in zoom-in-95 duration-150"
			onClick={(e) => e.stopPropagation()}
			onPointerDown={(e) => e.stopPropagation()}
		>
			{fittingSizes.map((size) => {
				const isCurrent = size.w === currentSize.w && size.h === currentSize.h
				return (
					<button
						key={`${size.w}x${size.h}`}
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onSelectSize(size)
						}}
						className={`px-2 py-1 text-xs font-medium rounded-lg cursor-pointer transition-all duration-150 ${
							isCurrent
								? 'bg-primary text-white shadow-sm scale-105'
								: 'bg-base-100/60 text-content hover:bg-base-100 hover:text-content'
						}`}
					>
						{size.w}×{size.h}
					</button>
				)
			})}
		</div>
	)
}
