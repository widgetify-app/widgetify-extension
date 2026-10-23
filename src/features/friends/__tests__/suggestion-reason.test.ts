import { describe, expect, it } from 'bun:test'
import { suggestionReason } from '../utils/suggestion-reason'

describe('suggestionReason', () => {
	it('names mutual friends first', () => {
		expect(
			suggestionReason({
				mutualCount: 2,
				sharedInterests: ['Reading'],
				city: 'Tehran',
			})
		).toEqual({ kind: 'mutual', value: 2 })
	})

	it('then the first shared interest', () => {
		expect(
			suggestionReason({
				mutualCount: 0,
				sharedInterests: ['Reading', 'Music'],
				city: 'Tehran',
			})
		).toEqual({ kind: 'interest', value: 'Reading' })
	})

	it('then the city', () => {
		expect(
			suggestionReason({ mutualCount: 0, sharedInterests: [], city: 'Tehran' })
		).toEqual({
			kind: 'city',
			value: 'Tehran',
		})
	})

	it('gives nothing when there is no reason', () => {
		expect(
			suggestionReason({ mutualCount: 0, sharedInterests: [], city: null })
		).toBeNull()
	})
})
