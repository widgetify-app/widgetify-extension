import { CacheNames } from './cache-names'
import {
	BYTES_HEADER,
	CATALOG_MEDIA_LIMITS,
	isWorthCaching,
	readStampedNumber,
	STORED_AT_HEADER,
	selectMediaToEvict,
} from './media-cache-budget'

async function stampForCache(response: Response): Promise<Response | null> {
	if (response.status !== 200 || response.type === 'opaque') return null

	const body = await response.blob()
	if (!isWorthCaching(body.size, CATALOG_MEDIA_LIMITS)) return null

	const headers = new Headers(response.headers)
	headers.set(STORED_AT_HEADER, String(Date.now()))
	headers.set(BYTES_HEADER, String(body.size))
	return new Response(body, { status: 200, statusText: response.statusText, headers })
}

async function evictCatalogMedia(): Promise<void> {
	try {
		const cache = await caches.open(CacheNames.catalogMedia)
		const requests = await cache.keys()
		const entries = await Promise.all(
			requests.map(async (request) => {
				const response = await cache.match(request)
				const headers = response?.headers
				return {
					url: request.url,
					bytes: readStampedNumber(headers?.get(BYTES_HEADER) ?? null),
					storedAt: readStampedNumber(headers?.get(STORED_AT_HEADER) ?? null),
				}
			})
		)

		const evicted = selectMediaToEvict(entries, CATALOG_MEDIA_LIMITS, Date.now())
		await Promise.all(evicted.map((url) => cache.delete(url)))
	} catch {}
}

let running: Promise<void> | null = null
let runAgain = false

export function trimCatalogMedia(): Promise<void> {
	if (running) {
		runAgain = true
		return running
	}

	running = (async () => {
		do {
			runAgain = false
			await evictCatalogMedia()
		} while (runAgain)
	})().finally(() => {
		running = null
	})
	return running
}

export const catalogMediaPlugin = {
	cacheWillUpdate: async ({ response }: { response: Response }) =>
		stampForCache(response),
	cacheDidUpdate: async () => {
		await trimCatalogMedia()
	},
	handlerDidError: async ({ request }: { request: Request }) => fetch(request),
}
