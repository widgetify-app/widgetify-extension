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

	it('then the same city, ahead of shared interests', () => {
		expect(
			suggestionReason({
				mutualCount: 0,
				sharedInterests: ['Reading'],
				city: 'Tehran',
			})
		).toEqual({ kind: 'city', value: 'Tehran' })
	})

	it('then the first shared interest', () => {
		expect(
			suggestionReason({
				mutualCount: 0,
				sharedInterests: ['Reading', 'Music'],
				city: null,
			})
		).toEqual({ kind: 'interest', value: 'Reading' })
	})

	it('gives nothing when there is no reason', () => {
		expect(
			suggestionReason({ mutualCount: 0, sharedInterests: [], city: null })
		).toBeNull()
	})
})
