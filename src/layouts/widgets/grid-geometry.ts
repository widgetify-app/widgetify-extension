import type { StoredWidget, WidgetPosition, WidgetSize } from './layout-engine/types'

export interface PixelRect {
	left: number
	top: number
	width: number
	height: number
}

export function getCellWidth(
	containerWidth: number,
	cols: number,
	gap: number
): number {
	if (cols <= 0) return 0
	return (containerWidth - (cols - 1) * gap) / cols
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

export function getCanvasRowCount(layout: StoredWidget[]): number {
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

export function pixelToGrid(
	pixelX: number,
	pixelY: number,
	cellWidth: number,
	cellHeight: number,
	gap: number
): WidgetPosition {
	const unitW = cellWidth + gap
	const unitH = cellHeight + gap
	const col = unitW > 0 ? Math.round(pixelX / unitW) : 0
	const row = unitH > 0 ? Math.round(pixelY / unitH) : 0
	return {
		col: Math.max(0, col),
		row: Math.max(0, row),
	}
}

export function gridToPixel(
	col: number,
	row: number,
	cellWidth: number,
	cellHeight: number,
	gap: number
): { left: number; top: number } {
	return {
		left: col * (cellWidth + gap),
		top: row * (cellHeight + gap),
	}
}
