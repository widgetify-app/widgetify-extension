import { DEFAULT_CELL_HEIGHT, DEFAULT_GAP } from '../layout-engine/constants'
import type { StoredWidget } from '../layout-engine/types'
import type { PresetLayout } from './types'

export function getViewportCanvasRows(): number {
	if (typeof window === 'undefined') return 6
	const availableHeight = window.innerHeight - 80
	const unitH = DEFAULT_CELL_HEIGHT + DEFAULT_GAP
	return Math.max(6, Math.floor(availableHeight / unitH))
}

export function resolvePresetWidgetsForViewport(
	preset: PresetLayout,
	targetRows?: number
): StoredWidget[] {
	if (!preset.widgets || preset.widgets.length === 0) return []

	const align = preset.verticalAlign || 'top'
	const totalRows = targetRows ?? getViewportCanvasRows()

	if (align === 'split-bottom') {
		const topWidgets = preset.widgets.filter((w) => w.position.row === 0)
		const bottomWidgets = preset.widgets.filter((w) => w.position.row > 0)

		if (bottomWidgets.length === 0) {
			return preset.widgets
		}

		const bottomMinRow = Math.min(...bottomWidgets.map((w) => w.position.row))
		const bottomMaxRow = Math.max(
			...bottomWidgets.map((w) => w.position.row + w.size.h)
		)
		const bottomHeight = bottomMaxRow - bottomMinRow
		const targetStartRow = Math.max(1, totalRows - bottomHeight)

		return [
			...topWidgets,
			...bottomWidgets.map((w) => ({
				...w,
				position: {
					...w.position,
					row: w.position.row - bottomMinRow + targetStartRow,
				},
			})),
		]
	}

	const minRow = Math.min(...preset.widgets.map((w) => w.position.row))
	const maxRow = Math.max(...preset.widgets.map((w) => w.position.row + w.size.h))
	const presetHeight = maxRow - minRow

	let startRow = 0
	if (align === 'center') {
		startRow = Math.max(0, Math.floor((totalRows - presetHeight) / 2))
	} else if (align === 'bottom') {
		startRow = Math.max(0, totalRows - presetHeight)
	}

	return preset.widgets.map((w) => ({
		...w,
		position: {
			...w.position,
			row: w.position.row - minRow + startRow,
		},
	}))
}
