/**
 * Utility function to preload images for faster rendering
 */
export function preloadImages(images: string[]): void {
	images.forEach((src) => {
		if (!src) return
		const img = new Image()
		img.src = src
	})
}
