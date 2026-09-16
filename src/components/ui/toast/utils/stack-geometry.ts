export type StackAnchor = 'left' | 'center' | 'right'

export const STACK_GAP = 10
export const STACK_SCALE_STEP = 0.05
export const STACK_VISIBLE_LAYERS = 3

export function getStackAnchor(position: string): StackAnchor {
	if (position.includes('center')) return 'center'
	return position.includes('right') ? 'right' : 'left'
}

export function getStackLayer(depth: number) {
	return Math.min(depth, STACK_VISIBLE_LAYERS)
}

export function getStackScale(layer: number) {
	return 1 - layer * STACK_SCALE_STEP
}

export function getStackShift(
	layer: number,
	height: number | undefined,
	tallestHeight: number | undefined
) {
	if (layer === 0) return 0
	if (!height || !tallestHeight) return layer * STACK_GAP
	return tallestHeight + layer * STACK_GAP - height * getStackScale(layer)
}
