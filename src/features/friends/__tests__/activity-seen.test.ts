import { describe, expect, it } from 'bun:test'
import { rememberSeen, unseenIds } from '../utils/activity-seen'

describe('unseenIds', () => {
	it('marks the statuses that were not seen before', () => {
		expect(unseenIds(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c'])
	})
})

describe('rememberSeen', () => {
	it('adds the current statuses and keeps the newest ones under the cap', () => {
		expect(rememberSeen(['x', 'y'], ['a', 'x'], 3)).toEqual(['y', 'a', 'x'])
	})
})
