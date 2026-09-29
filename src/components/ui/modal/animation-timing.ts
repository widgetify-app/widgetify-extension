export const EXIT_ANIMATION_MS = 360

export function isRetainableValue(value: unknown): boolean {
	return value !== null && value !== undefined && value !== false
}
