import { describe, expect, it } from 'bun:test'
import { dismissRequest } from '@/services/extension/notification-map'

describe('dismissRequest', () => {
	it('marks an inbox item as read', () => {
		expect(dismissRequest('a', 'inbox')).toEqual({
			url: '/v2/notifications/read',
			body: { ids: ['a'] },
		})
	})

	it('dismisses a broadcast surface', () => {
		expect(dismissRequest('b', 'broadcast')).toEqual({
			url: '/v2/notifications/surfaces/b/dismiss',
		})
	})
})
