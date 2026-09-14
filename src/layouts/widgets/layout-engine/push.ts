import { doRectanglesOverlap } from './collision'
import { compactLayout } from './compact'
import type { StoredWidget, WidgetPosition, WidgetSize } from './types'

export interface ResolveCollisionsOptions {
	compact?: boolean
}

export interface PushDownwardResult {
	layout: StoredWidget[]
	displacedIds: Set<string>
}

function overlapsAny(
	position: WidgetPosition,
	size: WidgetSize,
	placed: StoredWidget[]
): boolean {
	for (const other of placed) {
		if (doRectanglesOverlap(position, size, other.position, other.size)) {
			return true
		}
	}
	return false
}

function hasPinnedOverlap(pinned: StoredWidget[]): boolean {
	for (let i = 0; i < pinned.length; i++) {
		for (let j = i + 1; j < pinned.length; j++) {
			if (
				doRectanglesOverlap(
					pinned[i].position,
					pinned[i].size,
					pinned[j].position,
					pinned[j].size
				)
			) {
				return true
			}
		}
	}
	return false
}

export function pushDownward(
	layout: StoredWidget[],
	fixedIds: Set<string>
): PushDownwardResult {
	const pinned: StoredWidget[] = []
	const movable: StoredWidget[] = []

	for (const widget of layout) {
		if (fixedIds.has(widget.instanceId)) {
			pinned.push(widget)
		} else {
			movable.push(widget)
		}
	}

	if (hasPinnedOverlap(pinned)) {
		if (import.meta.env.DEV) {
			console.error(
				'[layout-engine] pushDownward received overlapping pinned widgets',
				pinned.map((w) => w.instanceId)
			)
		}
		return { layout, displacedIds: new Set() }
	}

	movable.sort((a, b) => {
		if (a.position.row !== b.position.row) {
			return a.position.row - b.position.row
		}
		if (a.position.col !== b.position.col) {
			return a.position.col - b.position.col
		}
		return a.instanceId < b.instanceId ? -1 : a.instanceId > b.instanceId ? 1 : 0
	})

	const placed: StoredWidget[] = [...pinned]
	const resolved = new Map<string, StoredWidget>()
	const displacedIds = new Set<string>()

	for (const widget of pinned) {
		resolved.set(widget.instanceId, widget)
	}

	for (const widget of movable) {
		let row = widget.position.row

		while (
			overlapsAny({ col: widget.position.col, row }, widget.size, placed)
		) {
			row++
		}

		let next = widget
		if (row !== widget.position.row) {
			next = { ...widget, position: { col: widget.position.col, row } }
			displacedIds.add(widget.instanceId)
		}

		placed.push(next)
		resolved.set(widget.instanceId, next)
	}

	if (displacedIds.size === 0) {
		return { layout, displacedIds }
	}

	return {
		layout: layout.map((w) => resolved.get(w.instanceId) ?? w),
		displacedIds,
	}
}

export function resolveCollisions(
	layout: StoredWidget[],
	fixedIds: Set<string>,
	cols: number,
	options?: ResolveCollisionsOptions
): StoredWidget[] {
	const { layout: pushed, displacedIds } = pushDownward(layout, fixedIds)

	if (!options?.compact || displacedIds.size === 0) {
		return pushed
	}

	return compactLayout(pushed, cols, { fixedIds, onlyIds: displacedIds })
}
