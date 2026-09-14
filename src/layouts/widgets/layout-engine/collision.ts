import type { StoredWidget, WidgetPosition, WidgetSize } from './types'

export function doRectanglesOverlap(
	posA: WidgetPosition,
	sizeA: WidgetSize,
	posB: WidgetPosition,
	sizeB: WidgetSize
): boolean {
	const overlapsH =
		posA.col < posB.col + sizeB.w && posA.col + sizeA.w > posB.col
	const overlapsV =
		posA.row < posB.row + sizeB.h && posA.row + sizeA.h > posB.row

	return overlapsH && overlapsV
}

export function rectanglesOverlap(
	a: StoredWidget,
	b: StoredWidget
): boolean {
	return doRectanglesOverlap(a.position, a.size, b.position, b.size)
}

export function getCollisions(
	widget: StoredWidget,
	layout: StoredWidget[]
): StoredWidget[] {
	return layout.filter(
		(other) =>
			other.instanceId !== widget.instanceId &&
			rectanglesOverlap(widget, other)
	)
}

export function hasAnyCollision(layout: StoredWidget[]): boolean {
	for (let i = 0; i < layout.length; i++) {
		for (let j = i + 1; j < layout.length; j++) {
			if (rectanglesOverlap(layout[i], layout[j])) {
				return true
			}
		}
	}
	return false
}
