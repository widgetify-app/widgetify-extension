import type { StoredWidget } from './types'

export function isSameWidgetState(a: StoredWidget, b: StoredWidget): boolean {
	return (
		a.instanceId === b.instanceId &&
		a.id === b.id &&
		a.position.col === b.position.col &&
		a.position.row === b.position.row &&
		a.size.w === b.size.w &&
		a.size.h === b.size.h &&
		a.meta === b.meta &&
		a.disabled === b.disabled &&
		a.widgetId === b.widgetId
	)
}

export function reconcileIdentity(
	prev: StoredWidget[],
	next: StoredWidget[]
): StoredWidget[] {
	if (prev === next) return prev

	const previousById = new Map<string, StoredWidget>()
	for (const widget of prev) {
		previousById.set(widget.instanceId, widget)
	}

	let reusedAll = prev.length === next.length
	const merged = next.map((widget, index) => {
		const previous = previousById.get(widget.instanceId)
		if (previous && isSameWidgetState(previous, widget)) {
			if (prev[index] !== previous) {
				reusedAll = false
			}
			return previous
		}
		reusedAll = false
		return widget
	})

	return reusedAll ? prev : merged
}
