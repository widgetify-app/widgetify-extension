import type { StoredWidget, WidgetPosition, WidgetSize } from './layout-engine/types'

interface PixelRect {
	left: number
	top: number
	width: number
	height: number
}

export function getWidgetPixelRect(
	position: WidgetPosition,
	size: WidgetSize,
	cellWidth: number,
	cellHeight: number,
	gap: number
): PixelRect {
	const left = position.col * (cellWidth + gap)
	const top = position.row * (cellHeight + gap)
	const width = size.w * cellWidth + (size.w - 1) * gap
	const height = size.h * cellHeight + (size.h - 1) * gap

	return { left, top, width, height }
}

function getCanvasRowCount(layout: StoredWidget[]): number {
	if (layout.length === 0) return 0
	return Math.max(...layout.map((w) => w.position.row + w.size.h), 0)
}

export function getCanvasHeight(
	layout: StoredWidget[],
	cellHeight: number,
	gap: number
): number {
	const rows = getCanvasRowCount(layout)
	if (rows === 0) return 0
	return rows * cellHeight + Math.max(0, rows - 1) * gap
}
