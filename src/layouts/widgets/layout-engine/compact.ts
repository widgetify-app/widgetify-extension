import { doRectanglesOverlap } from './collision'
import type { StoredWidget } from './types'

export interface CompactOptions {
	fixedIds?: Set<string>
	onlyIds?: Set<string>
}

export function compactLayout(
	layout: StoredWidget[],
	cols: number,
	fixedIdsOrOptions?: Set<string> | CompactOptions
): StoredWidget[] {
	const options: CompactOptions =
		fixedIdsOrOptions instanceof Set
			? { fixedIds: fixedIdsOrOptions }
			: (fixedIdsOrOptions ?? {})

	const fixedIds = options.fixedIds ?? new Set<string>()
	const onlyIds = options.onlyIds

	const isFrozen = (instanceId: string) =>
		fixedIds.has(instanceId) || (onlyIds !== undefined && !onlyIds.has(instanceId))

	const sorted = [...layout].sort((a, b) => {
		if (a.position.row !== b.position.row) {
			return a.position.row - b.position.row
		}
		return a.position.col - b.position.col
	})

	const result: StoredWidget[] = []
	const resolved = new Map<string, StoredWidget>()
	let changed = false

	for (const widget of sorted) {
		if (isFrozen(widget.instanceId)) {
			result.push(widget)
			resolved.set(widget.instanceId, widget)
			continue
		}

		let bestRow = widget.position.row

		for (let r = widget.position.row - 1; r >= 0; r--) {
			let collides = false

			for (const placed of result) {
				if (
					doRectanglesOverlap(
						{ col: widget.position.col, row: r },
						widget.size,
						placed.position,
						placed.size
					)
				) {
					collides = true
					break
				}
			}

			if (!collides) {
				for (const other of layout) {
					if (
						isFrozen(other.instanceId) &&
						other.instanceId !== widget.instanceId &&
						doRectanglesOverlap(
							{ col: widget.position.col, row: r },
							widget.size,
							other.position,
							other.size
						)
					) {
						collides = true
						break
					}
				}
			}

			if (!collides) {
				bestRow = r
			} else {
				break
			}
		}

		let next = widget
		if (bestRow !== widget.position.row) {
			next = { ...widget, position: { col: widget.position.col, row: bestRow } }
			changed = true
		}

		result.push(next)
		resolved.set(widget.instanceId, next)
	}

	if (!changed) {
		return layout
	}

	return layout.map((w) => resolved.get(w.instanceId) ?? w)
}

export function compactVerticalGaps(
	layout: StoredWidget[],
	targetRows: number
): StoredWidget[] {
	if (layout.length === 0 || targetRows <= 0) return layout

	const maxWidgetRow = Math.max(...layout.map((w) => w.position.row + w.size.h))
	if (maxWidgetRow <= targetRows) {
		return layout
	}

	const occupiedRows = new Set<number>()
	for (const w of layout) {
		for (let r = w.position.row; r < w.position.row + w.size.h; r++) {
			occupiedRows.add(r)
		}
	}

	const emptyRows: number[] = []
	for (let r = 0; r < maxWidgetRow; r++) {
		if (!occupiedRows.has(r)) {
			emptyRows.push(r)
		}
	}

	if (emptyRows.length === 0) {
		return layout
	}

	const excessRows = maxWidgetRow - targetRows
	const rowsToRemoveCount = Math.min(emptyRows.length, excessRows)
	const rowsToRemove = new Set(emptyRows.slice(-rowsToRemoveCount))

	return layout.map((w) => {
		let shift = 0
		for (const r of rowsToRemove) {
			if (r < w.position.row) {
				shift++
			}
		}
		if (shift === 0) return w
		return {
			...w,
			position: {
				...w.position,
				row: Math.max(0, w.position.row - shift),
			},
		}
	})
}
