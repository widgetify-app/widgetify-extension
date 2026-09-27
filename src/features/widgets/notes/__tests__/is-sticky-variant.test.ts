import { describe, expect, it } from 'bun:test'
import { isStickyVariant } from '../utils/is-sticky-variant'

const LIST_SIZE = { w: 2, h: 3 }
const STICKY_SIZE = { w: 2, h: 2 }

describe('isStickyVariant', () => {
	it('trusts an explicit variant over the size', () => {
		expect(isStickyVariant(LIST_SIZE, { variant: 'sticky' })).toBe(true)
		expect(isStickyVariant(STICKY_SIZE, { variant: 'list' })).toBe(false)
	})

	it('falls back to the 2x2 size when no variant is stored', () => {
		expect(isStickyVariant(STICKY_SIZE)).toBe(true)
		expect(isStickyVariant(STICKY_SIZE, {})).toBe(true)
		expect(isStickyVariant(LIST_SIZE)).toBe(false)
	})

	it('does not treat other sizes as sticky', () => {
		expect(isStickyVariant({ w: 1, h: 1 })).toBe(false)
		expect(isStickyVariant({ w: 4, h: 3 })).toBe(false)
		expect(isStickyVariant({ w: 2, h: 1 })).toBe(false)
	})

	it('ignores unrelated meta keys', () => {
		expect(isStickyVariant(STICKY_SIZE, { activeNoteId: 'abc' })).toBe(true)
		expect(isStickyVariant(LIST_SIZE, { activeNoteId: 'abc' })).toBe(false)
	})
})
