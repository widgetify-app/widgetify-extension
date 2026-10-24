export const MENU_EDGE = 12

export type MenuSide = 'below' | 'above'

interface VerticalFit {
	top: number
	flipBottom: number
	height: number
	viewportHeight: number
}

export function pickMenuSide({
	top,
	flipBottom,
	height,
	viewportHeight,
}: VerticalFit): MenuSide {
	if (top + height <= viewportHeight - MENU_EDGE) return 'below'
	if (flipBottom - height >= MENU_EDGE) return 'above'

	return viewportHeight - top >= flipBottom ? 'below' : 'above'
}

export function placeMenuOnSide(
	side: MenuSide,
	{ top, flipBottom, height, viewportHeight }: VerticalFit
): number {
	const lowest = viewportHeight - MENU_EDGE - height
	const preferred = side === 'below' ? top : flipBottom - height

	return Math.max(MENU_EDGE, Math.min(preferred, lowest))
}

export function fitMenuHorizontally(
	left: number,
	width: number,
	viewportWidth: number
): number {
	return Math.min(Math.max(MENU_EDGE, left), viewportWidth - width - MENU_EDGE)
}
