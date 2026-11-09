import { describe, expect, it } from 'bun:test'
import {
	NETWORK_FIRST_API_PATHS,
	NEVER_CACHE_API_PATHS,
	SWR_API_PATHS,
} from '../cache-config'

describe('the service worker cache', () => {
	it('does not keep a copy of the notification replies', () => {
		const cached = [
			...NETWORK_FIRST_API_PATHS,
			...SWR_API_PATHS,
			...NEVER_CACHE_API_PATHS,
		]

		expect(cached.some((path) => path.includes('notifications'))).toBe(false)
	})
})
