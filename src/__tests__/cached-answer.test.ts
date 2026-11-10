import { describe, expect, it } from 'bun:test'
import { cachedAnswer } from '@/services/push/cached-answer'

function parts(cached: boolean | null) {
	const calls = { load: 0, saved: [] as boolean[] }

	return {
		calls,
		read: async () => cached,
		load: async () => {
			calls.load += 1

			return true
		},
		save: async (value: boolean) => {
			calls.saved.push(value)
		},
	}
}

describe('cachedAnswer', () => {
	it('answers from the saved value and never asks the server', async () => {
		const { calls, ...rest } = parts(false)

		expect(await cachedAnswer(rest)).toBe(false)
		expect(calls.load).toBe(0)
		expect(calls.saved).toEqual([])
	})

	it('asks the server once when nothing is saved, and saves what it said', async () => {
		const { calls, ...rest } = parts(null)

		expect(await cachedAnswer(rest)).toBe(true)
		expect(calls.load).toBe(1)
		expect(calls.saved).toEqual([true])
	})

	it('does not save when the server fails', async () => {
		const saved: boolean[] = []

		await expect(
			cachedAnswer({
				read: async () => null,
				load: async () => {
					throw new Error('offline')
				},
				save: async (value: boolean) => {
					saved.push(value)
				},
			})
		).rejects.toThrow('offline')

		expect(saved).toEqual([])
	})
})
