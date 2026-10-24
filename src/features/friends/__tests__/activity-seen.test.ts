import { describe, expect, it } from 'bun:test'
import { reactionCaption, rememberSeen, unseenIds } from '../utils/activity-seen'

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

describe('reactionCaption', () => {
	it('says nothing without reactions', () => {
		expect(reactionCaption(0, undefined)).toBeNull()
	})

	it('counts until the names arrive', () => {
		expect(reactionCaption(3, undefined)).toEqual({ kind: 'count', count: 3 })
	})

	it('names the one who reacted', () => {
		expect(reactionCaption(1, 'Sara')).toEqual({ kind: 'one', name: 'Sara' })
	})

	it('names one and counts the others', () => {
		expect(reactionCaption(3, 'Sara')).toEqual({
			kind: 'many',
			name: 'Sara',
			others: 2,
		})
	})
})
