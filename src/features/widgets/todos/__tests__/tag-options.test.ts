import { describe, expect, it } from 'bun:test'
import { cleanTags, matchTags, newTagName } from '../utils/tag-options'

describe('cleanTags', () => {
	it('drops blank and repeated labels', () => {
		expect(cleanTags(['خونه', '', '  ', 'کار', ' خونه '])).toEqual(['خونه', 'کار'])
	})

	it('copes with no labels yet', () => {
		expect(cleanTags(undefined)).toEqual([])
	})
})

describe('matchTags', () => {
	it('keeps every label for an empty search', () => {
		expect(matchTags(['خونه', 'کار'], '  ')).toEqual(['خونه', 'کار'])
	})

	it('finds a label by part of its name, in any case', () => {
		expect(matchTags(['Work', 'خونه', 'workout'], 'WORK')).toEqual([
			'Work',
			'workout',
		])
	})
})

describe('newTagName', () => {
	it('offers the typed name when no label has it', () => {
		expect(newTagName(['خونه'], ' باشگاه ')).toBe('باشگاه')
	})

	it('does not offer a label that already exists', () => {
		expect(newTagName(['Work'], 'work')).toBeNull()
	})

	it('offers nothing for an empty box', () => {
		expect(newTagName(['خونه'], '')).toBeNull()
	})
})
