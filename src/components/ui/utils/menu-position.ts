const MENU_EDGE = 12

interface VerticalFit {
	top: number
	flipBottom: number
	height: number
	viewportHeight: number
}

export function fitMenuVertically({
	top,
	flipBottom,
	height,
	viewportHeight,
}: VerticalFit): number {
	const lowest = viewportHeight - MENU_EDGE - height
	if (top <= lowest) return Math.max(MENU_EDGE, top)

	const above = flipBottom - height
	if (above >= MENU_EDGE) return above

	return Math.max(MENU_EDGE, lowest)
}

export function fitMenuHorizontally(
	left: number,
	width: number,
	viewportWidth: number
): number {
	return Math.min(Math.max(MENU_EDGE, left), viewportWidth - width - MENU_EDGE)
}
