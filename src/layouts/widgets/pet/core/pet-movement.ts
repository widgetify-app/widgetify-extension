export interface Position {
	x: number
	y: number
}

export interface MovementBounds {
	minX: number
	maxX: number
	minY: number
	maxY: number
}

export const EDGE_PADDING = 10
export const NEAR_WALL_THRESHOLD = 5
export const REFERENCE_FRAME_MS = 16.67

export function getMovementBounds(
	containerWidth: number,
	containerHeight: number,
	spriteWidth: number,
	spriteHeight: number,
	maxHeight: number
): MovementBounds {
	const width = containerWidth || 0
	const height = containerHeight || 0

	return {
		minX: EDGE_PADDING,
		maxX: Math.max(EDGE_PADDING, width - spriteWidth - EDGE_PADDING),
		minY: 0,
		maxY: Math.max(0, Math.min(maxHeight, height - spriteHeight)),
	}
}

export function clampToBounds(position: Position, bounds: MovementBounds): Position {
	return {
		x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
		y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y)),
	}
}

export function isNearWall(x: number, bounds: MovementBounds): boolean {
	return (
		x <= bounds.minX + NEAR_WALL_THRESHOLD || x >= bounds.maxX - NEAR_WALL_THRESHOLD
	)
}

export function pickClimbWall(x: number, bounds: MovementBounds): number {
	const distanceToMin = Math.abs(x - bounds.minX)
	const distanceToMax = Math.abs(bounds.maxX - x)
	return distanceToMax < distanceToMin ? bounds.maxX : bounds.minX
}

export function directionTowardWall(wallX: number, bounds: MovementBounds): number {
	return wallX === bounds.maxX ? 1 : -1
}

export function stepWalk(
	position: Position,
	direction: number,
	speed: number,
	fallSpeed: number,
	bounds: MovementBounds
): { position: Position; direction: number } {
	let x = position.x + direction * speed
	let nextDirection = direction

	if (x >= bounds.maxX) {
		nextDirection = -1
		x = bounds.maxX
	} else if (x <= bounds.minX) {
		nextDirection = 1
		x = bounds.minX
	}

	const y = position.y > 0 ? Math.max(0, position.y - fallSpeed) : 0

	return { position: { x, y }, direction: nextDirection }
}

export function frameScale(deltaMs: number): number {
	if (!Number.isFinite(deltaMs) || deltaMs <= 0) return 1
	return Math.min(deltaMs / REFERENCE_FRAME_MS, 3)
}
