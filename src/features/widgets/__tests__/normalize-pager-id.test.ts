import { describe, expect, it } from 'bun:test'
import { isPagerIdStale, normalizePagerId } from '../utils/normalize-pager-id'

describe('normalizePagerId', () => {
	it('keeps a usable id', () => {
		expect(normalizePagerId('habit-1')).toBe('habit-1')
		expect(normalizePagerId('  habit-1 ')).toBe('habit-1')
	})

	it('drops anything that is not a non-empty string', () => {
		expect(normalizePagerId(null)).toBeNull()
		expect(normalizePagerId(undefined)).toBeNull()
		expect(normalizePagerId('')).toBeNull()
		expect(normalizePagerId('   ')).toBeNull()
		expect(normalizePagerId(7)).toBeNull()
		expect(normalizePagerId({ id: 'a' })).toBeNull()
	})
})

describe('isPagerIdStale', () => {
	it('is stale when the saved item is gone from a loaded list', () => {
		expect(isPagerIdStale('b', ['a', 'c'], true)).toBe(true)
	})

	it('is not stale while the list is still loading', () => {
		expect(isPagerIdStale('b', [], false)).toBe(false)
	})

	it('is not stale when the item is still there or nothing is saved', () => {
		expect(isPagerIdStale('a', ['a', 'c'], true)).toBe(false)
		expect(isPagerIdStale(null, ['a'], true)).toBe(false)
	})
})
