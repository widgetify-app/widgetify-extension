import { doRectanglesOverlap } from './collision'
import type { StoredWidget, WidgetPosition, WidgetSize } from './types'

export function findAvailableSlot(
	layout: StoredWidget[],
	size: WidgetSize,
	cols: number
): WidgetPosition {
	const maxRow =
		layout.length > 0
			? Math.max(...layout.map((w) => w.position.row + w.size.h)) + 2
			: 2

	const clampedW = Math.min(size.w, cols)

	for (let row = 0; row <= maxRow + 10; row++) {
		for (let col = 0; col <= cols - clampedW; col++) {
			let collides = false

			for (const widget of layout) {
				if (
					doRectanglesOverlap(
						{ col, row },
						{ w: clampedW, h: size.h },
						widget.position,
						widget.size
					)
				) {
					collides = true
					break
				}
			}

			if (!collides) {
				return { col, row }
			}
		}
	}

	return { col: 0, row: maxRow }
}

export function getBestAllowedSizeForColumns(
	allowedSizes: WidgetSize[],
	currentSize: WidgetSize,
	cols: number
): WidgetSize {
	if (currentSize.w <= cols) {
		const isCurrentAllowed = allowedSizes.some(
			(s) => s.w === currentSize.w && s.h === currentSize.h
		)
		if (isCurrentAllowed) {
			return currentSize
		}
	}

	const fittingSizes = allowedSizes.filter((s) => s.w <= cols)
	if (fittingSizes.length === 0) {
		return {
			w: Math.max(1, Math.min(cols, currentSize.w)),
			h: currentSize.h,
		}
	}

	fittingSizes.sort((a, b) => {
		const diffW_A = Math.abs(a.w - currentSize.w)
		const diffW_B = Math.abs(b.w - currentSize.w)
		if (diffW_A !== diffW_B) {
			return diffW_A - diffW_B
		}
		const diffH_A = Math.abs(a.h - currentSize.h)
		const diffH_B = Math.abs(b.h - currentSize.h)
		return diffH_A - diffH_B
	})

	return fittingSizes[0]
}
