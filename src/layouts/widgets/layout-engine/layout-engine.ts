import { compactLayout } from './compact'
import { findAvailableSlot, getBestAllowedSizeForColumns } from './placement'
import { resolveCollisions } from './push'
import type { LayoutEngineOptions, StoredWidget, WidgetSize } from './types'
import { isWithinHorizontalBounds, validateLayout } from './validation'

export function resolveLayoutChange(
	options: LayoutEngineOptions
): StoredWidget[] | null {
	const {
		layout,
		operation,
		instanceId,
		targetPosition,
		targetSize,
		newWidget,
		cols,
		allowedSizes,
	} = options

	const cloned: StoredWidget[] = layout.map((w) => ({
		...w,
		position: { ...w.position },
		size: { ...w.size },
	}))

	switch (operation) {
		case 'move': {
			if (!instanceId || !targetPosition) return null
			const index = cloned.findIndex((w) => w.instanceId === instanceId)
			if (index === -1) return null

			const widget = cloned[index]
			const clampedCol = Math.max(
				0,
				Math.min(cols - widget.size.w, targetPosition.col)
			)
			const clampedRow = Math.max(0, targetPosition.row)

			widget.position = { col: clampedCol, row: clampedRow }

			if (!isWithinHorizontalBounds(widget, cols)) {
				return null
			}

			const resolved = resolveCollisions(cloned, new Set([instanceId]), cols)
			if (!resolved) {
				return null
			}

			if (!validateLayout(resolved, cols)) {
				return null
			}

			return resolved
		}

		case 'resize': {
			if (!instanceId || !targetSize) return null
			const index = cloned.findIndex((w) => w.instanceId === instanceId)
			if (index === -1) return null

			const widget = cloned[index]
			if (targetSize.w > cols || targetSize.w <= 0 || targetSize.h <= 0) {
				return null
			}

			widget.size = { ...targetSize }

			if (!isWithinHorizontalBounds(widget, cols)) {
				widget.position.col = Math.max(0, cols - widget.size.w)
			}

			const resolved = resolveCollisions(cloned, new Set([instanceId]), cols)
			if (!resolved) {
				return null
			}

			if (!validateLayout(resolved, cols)) {
				return null
			}

			return resolved
		}

		case 'add': {
			if (!newWidget) return null
			if (newWidget.size.w > cols) return null

			const toAdd: StoredWidget = {
				...newWidget,
				position: { ...newWidget.position },
				size: { ...newWidget.size },
			}

			if (
				targetPosition &&
				targetPosition.col + toAdd.size.w <= cols &&
				targetPosition.col >= 0 &&
				targetPosition.row >= 0
			) {
				toAdd.position = { ...targetPosition }
				cloned.push(toAdd)

				const resolved = resolveCollisions(
					cloned,
					new Set([toAdd.instanceId]),
					cols
				)
				if (resolved && validateLayout(resolved, cols)) {
					return resolved
				}
				cloned.pop()
			}

			const slot = findAvailableSlot(cloned, toAdd.size, cols)
			toAdd.position = slot
			cloned.push(toAdd)

			if (!validateLayout(cloned, cols)) {
				return null
			}

			return cloned
		}

		case 'duplicate': {
			if (!instanceId) return null
			const original = cloned.find((w) => w.instanceId === instanceId)
			if (!original) return null

			const newInstanceId = `${original.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
			const duplicated: StoredWidget = {
				id: original.id,
				instanceId: newInstanceId,
				size: { ...original.size },
				position: { ...original.position },
			}

			const slot = findAvailableSlot(cloned, duplicated.size, cols)
			duplicated.position = slot
			cloned.push(duplicated)

			if (!validateLayout(cloned, cols)) {
				return null
			}

			return cloned
		}

		case 'remove': {
			if (!instanceId) return null
			const filtered = cloned.filter((w) => w.instanceId !== instanceId)
			if (!validateLayout(filtered, cols)) {
				return null
			}
			return filtered
		}

		case 'responsive-reflow': {
			const sorted = [...cloned].sort((a, b) => {
				if (a.position.row !== b.position.row) {
					return a.position.row - b.position.row
				}
				return a.position.col - b.position.col
			})

			const reflowed: StoredWidget[] = []

			for (const widget of sorted) {
				const validSizes = allowedSizes || [widget.size]
				const adaptedSize: WidgetSize = getBestAllowedSizeForColumns(
					validSizes,
					widget.size,
					cols
				)

				const slot = findAvailableSlot(reflowed, adaptedSize, cols)
				reflowed.push({
					...widget,
					size: adaptedSize,
					position: slot,
				})
			}

			const compacted = compactLayout(reflowed, cols)
			if (!validateLayout(compacted, cols)) {
				return null
			}

			return compacted
		}

		default:
			return null
	}
}
