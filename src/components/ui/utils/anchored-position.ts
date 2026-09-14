export type AnchoredSide =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'

export interface AnchorBox {
	top: number
	left: number
	right: number
	bottom: number
	width: number
	height: number
}

export interface OverlaySize {
	width: number
	height: number
}

export interface Viewport {
	width: number
	height: number
}

export interface AnchoredPlacement {
	anchor: HTMLElement
	x: number
	y: number
	side: AnchoredSide
}

export const EDGE_PADDING = 10

export function isAnchorInViewport(anchor: AnchorBox, viewport: Viewport): boolean {
	return (
		anchor.bottom > 0 &&
		anchor.right > 0 &&
		anchor.top < viewport.height &&
		anchor.left < viewport.width
	)
}

export function resolveAnchoredPlacement(
	anchor: AnchorBox,
	overlay: OverlaySize,
	viewport: Viewport,
	side: AnchoredSide,
	offset: number,
	allowFlip: boolean
): Omit<AnchoredPlacement, 'anchor'> {
	let resolvedSide = side
	let x = 0
	let y = 0

	switch (side) {
		case 'top':
			x = anchor.left + anchor.width / 2 - overlay.width / 2
			y = anchor.top - overlay.height - offset
			break
		case 'right':
			x = anchor.right + offset
			y = anchor.top + anchor.height / 2 - overlay.height / 2
			break
		case 'bottom':
			x = anchor.left + anchor.width / 2 - overlay.width / 2
			y = anchor.bottom + offset
			break
		case 'left':
			x = anchor.left - overlay.width - offset
			y = anchor.top + anchor.height / 2 - overlay.height / 2
			break
		case 'bottom-right':
			x = anchor.right
			y = anchor.bottom + offset
			break
		case 'bottom-left':
			x = anchor.left - overlay.width
			y = anchor.bottom + offset
			break
		case 'top-right':
			x = anchor.right
			y = anchor.top - overlay.height - offset
			break
		case 'top-left':
			x = anchor.left - overlay.width
			y = anchor.top - overlay.height - offset
			break
	}

	if (allowFlip) {
		if (side === 'top' && y < 0) {
			y = anchor.bottom + offset
			resolvedSide = 'bottom'
		} else if (side === 'bottom' && y + overlay.height > viewport.height) {
			y = anchor.top - overlay.height - offset
			resolvedSide = 'top'
		} else if (side === 'left' && x < 0) {
			x = anchor.right + offset
			resolvedSide = 'right'
		} else if (side === 'right' && x + overlay.width > viewport.width) {
			x = anchor.left - overlay.width - offset
			resolvedSide = 'left'
		}
	}

	return {
		x: shiftIntoViewport(x, overlay.width, viewport.width),
		y: shiftIntoViewport(y, overlay.height, viewport.height),
		side: resolvedSide,
	}
}

function shiftIntoViewport(start: number, size: number, viewportSize: number): number {
	const lastStart = viewportSize - size - EDGE_PADDING
	if (lastStart < EDGE_PADDING) return EDGE_PADDING
	return Math.max(EDGE_PADDING, Math.min(start, lastStart))
}
