import { hasAnyCollision } from './collision'
import type { StoredWidget, WidgetDefinition } from './types'

export function isWithinHorizontalBounds(
	widget: StoredWidget,
	cols: number
): boolean {
	return (
		widget.position.col >= 0 &&
		widget.size.w > 0 &&
		widget.position.col + widget.size.w <= cols
	)
}

export function isValidVerticalPosition(widget: StoredWidget): boolean {
	return widget.position.row >= 0 && widget.size.h > 0
}

export function validateLayout(
	layout: StoredWidget[],
	cols: number,
	registry?: Record<string, WidgetDefinition>
): boolean {
	const instanceIds = new Set<string>()

	for (const widget of layout) {
		if (!widget.instanceId || instanceIds.has(widget.instanceId)) {
			return false
		}
		instanceIds.add(widget.instanceId)

		if (!isWithinHorizontalBounds(widget, cols)) {
			return false
		}

		if (!isValidVerticalPosition(widget)) {
			return false
		}

		if (registry && registry[widget.id]) {
			const def = registry[widget.id]
			const sizeValid = def.allowedSizes.some(
				(s) => s.w === widget.size.w && s.h === widget.size.h
			)
			if (!sizeValid) {
				return false
			}
		}
	}

	if (hasAnyCollision(layout)) {
		return false
	}

	return true
}
