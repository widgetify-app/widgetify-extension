export function getNextSlideIndex(current: number, count: number): number {
	if (count <= 1) return 0
	return (current + 1) % count
}

export function getPrevSlideIndex(current: number, count: number): number {
	if (count <= 1) return 0
	return (current - 1 + count) % count
}

export function clampSlideIndex(index: number, count: number): number {
	if (count <= 0) return 0
	if (index < 0) return 0
	if (index >= count) return count - 1
	return index
}

export function resolveActiveSlideImage(
	images: string[] = [],
	index: number = 0,
	fallbackSrc?: string
): string | undefined {
	if (images.length === 0) return fallbackSrc
	if (images.length === 1) return images[0] || fallbackSrc
	const validIndex = (index + images.length) % images.length
	return images[validIndex] || fallbackSrc
}
