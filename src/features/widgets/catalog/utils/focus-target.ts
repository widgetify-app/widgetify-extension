export function focusTarget(
	key: unknown,
	registry: Record<string, unknown>
): string | null {
	if (typeof key !== 'string') return null

	const id = key.trim()

	return id.length > 0 && Object.hasOwn(registry, id) ? id : null
}
