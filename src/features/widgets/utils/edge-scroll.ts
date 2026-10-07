export const EDGE_SCROLL_ZONE_PX = 72
export const EDGE_SCROLL_MAX_STEP_PX = 18

export function edgeScrollStep(pointerY: number, top: number, bottom: number): number {
	const intoTop = top + EDGE_SCROLL_ZONE_PX - pointerY
	if (intoTop > 0) return -stepFor(intoTop)

	const intoBottom = pointerY - (bottom - EDGE_SCROLL_ZONE_PX)
	if (intoBottom > 0) return stepFor(intoBottom)

	return 0
}

function stepFor(depth: number): number {
	return Math.ceil(EDGE_SCROLL_MAX_STEP_PX * Math.min(1, depth / EDGE_SCROLL_ZONE_PX))
}
