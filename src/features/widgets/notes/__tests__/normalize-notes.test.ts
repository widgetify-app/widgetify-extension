import { describe, expect, it } from 'bun:test'
import { normalizeNote, normalizeNotes } from '../utils/normalize-notes'

const note = {
	id: 'a',
	title: 'خرید',
	body: 'نون',
	priority: 'high' as const,
	createdAt: 1,
	updatedAt: 2,
}

describe('normalizeNote', () => {
	it('turns a null title and body from the server into empty text', () => {
		const normalized = normalizeNote({ ...note, title: null, body: null })

		expect(normalized.title).toBe('')
		expect(normalized.body).toBe('')
	})

	it('reads a null priority as no colour', () => {
		expect(normalizeNote({ ...note, priority: null }).priority).toBeUndefined()
	})

	it('leaves a complete note as it is', () => {
		expect(normalizeNote(note)).toEqual(note)
	})
})

describe('normalizeNotes', () => {
	it('reads nothing usable as an empty list', () => {
		expect(normalizeNotes(undefined)).toEqual([])
		expect(normalizeNotes(null)).toEqual([])
		expect(normalizeNotes('notes')).toEqual([])
	})

	it('drops entries without an id', () => {
		expect(normalizeNotes([note, null, { title: 'بی‌شناسه' }])).toEqual([note])
	})

	it('fixes every note of a stored list', () => {
		const [stored] = normalizeNotes([{ ...note, body: null }])

		expect(stored.body).toBe('')
	})
})
