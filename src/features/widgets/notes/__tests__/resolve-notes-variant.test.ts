import { describe, expect, it } from 'bun:test'
import { resolveNotesVariant } from '../utils/resolve-notes-variant'

const LIST_SIZE = { w: 2, h: 3 }
const STICKY_SIZE = { w: 2, h: 2 }
const BOARD_SIZE = { w: 4, h: 3 }

describe('resolveNotesVariant', () => {
	it('trusts an explicit variant over the size', () => {
		expect(resolveNotesVariant(LIST_SIZE, { variant: 'sticky' })).toBe('sticky')
		expect(resolveNotesVariant(STICKY_SIZE, { variant: 'list' })).toBe('list')
		expect(resolveNotesVariant(LIST_SIZE, { variant: 'board' })).toBe('board')
	})

	it('falls back to the size when no variant is stored', () => {
		expect(resolveNotesVariant(STICKY_SIZE)).toBe('sticky')
		expect(resolveNotesVariant(STICKY_SIZE, {})).toBe('sticky')
		expect(resolveNotesVariant(BOARD_SIZE)).toBe('board')
		expect(resolveNotesVariant(LIST_SIZE)).toBe('list')
	})

	it('shows the list for any other size', () => {
		expect(resolveNotesVariant({ w: 1, h: 1 })).toBe('list')
		expect(resolveNotesVariant({ w: 2, h: 1 })).toBe('list')
	})

	it('falls back to the size for a stored variant it does not know', () => {
		const stored = { variant: 'grid' } as unknown as { variant: 'list' }
		expect(resolveNotesVariant(BOARD_SIZE, stored)).toBe('board')
		expect(resolveNotesVariant(LIST_SIZE, stored)).toBe('list')
	})

	it('ignores unrelated meta keys', () => {
		expect(resolveNotesVariant(STICKY_SIZE, { activeNoteId: 'abc' })).toBe('sticky')
		expect(resolveNotesVariant(LIST_SIZE, { activeNoteId: 'abc' })).toBe('list')
	})
})
