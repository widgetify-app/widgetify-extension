import { describe, expect, it } from 'bun:test'
import { resolveIsDone } from '../utils/resolve-is-done'

describe('resolveIsDone', () => {
	it('reads the task itself for its owner', () => {
		expect(resolveIsDone({ completed: true, owner: { isSelf: true } })).toBe(true)
	})

	it('reads the invited friend’s own progress on a shared task', () => {
		expect(
			resolveIsDone({
				completed: true,
				owner: { isSelf: false },
				friends: [
					{ isSelf: false, completed: true },
					{ isSelf: true, completed: false },
				],
			})
		).toBe(false)
	})

	it('falls back to the task when the user is not among the friends', () => {
		expect(resolveIsDone({ completed: true, owner: null, friends: [] })).toBe(true)
	})
})
