import { describe, expect, it } from 'bun:test'
import { coldTap } from '../utils/cold-tap'

describe('coldTap', () => {
	it('reads the notification and its link from the address the background opened', () => {
		expect(coldTap('?pushTap=n1&pushLink=%2Fnotifications%3Ftab%3Dall')).toEqual({
			notificationId: 'n1',
			link: '/notifications?tab=all',
		})
	})

	it('reads a tap with only an id or only a link', () => {
		expect(coldTap('?pushTap=n1')).toEqual({ notificationId: 'n1' })
		expect(coldTap('?pushLink=%2Ffriends')).toEqual({ link: '/friends' })
	})

	it('is null for any other address', () => {
		expect(coldTap('')).toBeNull()
		expect(coldTap('?tab=todos')).toBeNull()
	})
})
