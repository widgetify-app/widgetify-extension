import { doRectanglesOverlap, getCollisions, rectanglesOverlap } from './collision'
import type { StoredWidget, WidgetPosition, WidgetSize } from './types'

export function getPushCost(
	original: WidgetPosition,
	candidate: WidgetPosition
): number {
	const dx = Math.abs(candidate.col - original.col)
	const dy = Math.abs(candidate.row - original.row)
	return dx + dy * 2 + candidate.row * 0.05 + candidate.col * 0.01
}

export function generatePushCandidates(
	widget: StoredWidget,
	blocker: StoredWidget,
	layout: StoredWidget[],
	cols: number,
	fixedIds: Set<string>
): WidgetPosition[] {
	const candidates: WidgetPosition[] = []
	const seen = new Set<string>()

	const addCandidate = (col: number, row: number) => {
		if (col < 0 || col + widget.size.w > cols || row < 0) {
			return
		}
		const key = `${col},${row}`
		if (seen.has(key)) return
		seen.add(key)

		// A candidate must always escape the blocker that triggered this push,
		// otherwise the widget's own current (still-colliding) position would be
		// re-proposed as a "resolution", causing solve() to loop on a no-op.
		if (
			doRectanglesOverlap({ col, row }, widget.size, blocker.position, blocker.size)
		) {
			return
		}

		for (const other of layout) {
			if (fixedIds.has(other.instanceId)) {
				if (
					doRectanglesOverlap(
						{ col, row },
						widget.size,
						other.position,
						other.size
					)
				) {
					return
				}
			}
		}

		candidates.push({ col, row })
	}

	addCandidate(blocker.position.col + blocker.size.w, widget.position.row)
	addCandidate(blocker.position.col - widget.size.w, widget.position.row)
	addCandidate(widget.position.col, blocker.position.row + blocker.size.h)
	addCandidate(0, blocker.position.row + blocker.size.h)

	const maxScanRow = Math.max(
		...layout.map((w) => w.position.row + w.size.h),
		blocker.position.row + blocker.size.h + 4,
		8
	)

	for (let r = 0; r <= maxScanRow; r++) {
		for (let c = 0; c <= cols - widget.size.w; c++) {
			addCandidate(c, r)
		}
	}

	candidates.sort((a, b) => {
		const costA = getPushCost(widget.position, a)
		const costB = getPushCost(widget.position, b)
		return costA - costB
	})

	return candidates
}

export function resolveCollisions(
	layout: StoredWidget[],
	fixedIds: Set<string>,
	cols: number,
	maxDepth = 30
): StoredWidget[] | null {
	const findFirstCollision = (
		currentLayout: StoredWidget[]
	): { widget: StoredWidget; blocker: StoredWidget } | null => {
		for (const w of currentLayout) {
			const collisions = getCollisions(w, currentLayout)
			if (collisions.length > 0) {
				if (!fixedIds.has(w.instanceId)) {
					return { widget: w, blocker: collisions[0] }
				}
				const movable = collisions.find((c) => !fixedIds.has(c.instanceId))
				if (movable) {
					return { widget: movable, blocker: w }
				}
				return null
			}
		}
		return null
	}

	const solve = (
		currentLayout: StoredWidget[],
		depth: number
	): StoredWidget[] | null => {
		if (depth > maxDepth) {
			return null
		}

		const collision = findFirstCollision(currentLayout)
		if (!collision) {
			return currentLayout
		}

		const { widget, blocker } = collision
		const candidates = generatePushCandidates(
			widget,
			blocker,
			currentLayout,
			cols,
			fixedIds
		)

		const topCandidates = candidates.slice(0, 15)

		for (const pos of topCandidates) {
			const nextLayout = currentLayout.map((item) =>
				item.instanceId === widget.instanceId
					? { ...item, position: { ...pos } }
					: item
			)

			const result = solve(nextLayout, depth + 1)
			if (result) {
				return result
			}
		}

		return null
	}

	return solve(layout, 0)
}
