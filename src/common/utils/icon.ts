/**
 * Retrieves a favicon URL for a given website URL using Google's favicon service.
 *
 * This function takes a URL string, normalizes it by adding the HTTPS protocol if missing,
 * and returns a Google favicon service URL that provides a 64x64 pixel favicon for the domain.
 *
 * @param url - The website URL to get the favicon for. Can be with or without protocol.
 * @returns A Google favicon service URL string, or an empty string if the input is invalid or processing fails.
 *
 * @example
 * ```typescript
 * getFaviconFromUrl('') // Returns: ''
 * ```
 */
export const getFaviconFromUrl = (url: string): string => {
	try {
		if (!url.trim()) {
			return ''
		}

		let processedUrl = url
		if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
			processedUrl = `https://${processedUrl}`
		}

		const urlObj = new URL(processedUrl)
		return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
	} catch {
		return ''
	}
}
