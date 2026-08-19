import { doRectanglesOverlap } from './collision'
import type { StoredWidget } from './types'

export function compactLayout(
	layout: StoredWidget[],
	cols: number,
	fixedIds: Set<string> = new Set()
): StoredWidget[] {
	const sorted = [...layout].sort((a, b) => {
		if (a.position.row !== b.position.row) {
			return a.position.row - b.position.row
		}
		return a.position.col - b.position.col
	})

	const result: StoredWidget[] = []

	for (const widget of sorted) {
		if (fixedIds.has(widget.instanceId)) {
			result.push({ ...widget, position: { ...widget.position } })
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
				for (const fixed of layout) {
					if (
						fixedIds.has(fixed.instanceId) &&
						fixed.instanceId !== widget.instanceId
					) {
						if (
							doRectanglesOverlap(
								{ col: widget.position.col, row: r },
								widget.size,
								fixed.position,
								fixed.size
							)
						) {
							collides = true
							break
						}
					}
				}
			}

			if (!collides) {
				bestRow = r
			} else {
				break
			}
		}

		result.push({
			...widget,
			position: {
				col: widget.position.col,
				row: bestRow,
			},
		})
	}

	return result
}
