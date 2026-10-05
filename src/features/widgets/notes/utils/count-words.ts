export function countWords(text: string): number {
	const trimmed = text.trim()
	return trimmed ? trimmed.split(/\s+/).length : 0
}
