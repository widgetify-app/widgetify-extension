import { describe, expect, it } from 'bun:test'
import { addSeenIntro, normalizeSeenIntros } from '../utils/feature-intros'

describe('normalizeSeenIntros', () => {
	it('keeps the ids an older version saved, once each', () => {
		expect(normalizeSeenIntros(['a', 'b', 'a'])).toEqual(['a', 'b'])
	})

	it('drops anything that is not a non empty string', () => {
		expect(normalizeSeenIntros(['a', 1, null, '', { id: 'b' }])).toEqual(['a'])
	})

	it('reads a missing or broken value as nothing seen', () => {
		expect(normalizeSeenIntros(undefined)).toEqual([])
		expect(normalizeSeenIntros('a')).toEqual([])
		expect(normalizeSeenIntros({ a: true })).toEqual([])
	})

	it('keeps only the newest two hundred', () => {
		const many = Array.from({ length: 250 }, (_, index) => `intro-${index}`)
		const kept = normalizeSeenIntros(many)
		expect(kept).toHaveLength(200)
		expect(kept[0]).toBe('intro-50')
	})
})

describe('addSeenIntro', () => {
	it('adds an id once and returns the same list when it is already there', () => {
		const seen = ['a']
		expect(addSeenIntro(seen, 'b')).toEqual(['a', 'b'])
		expect(addSeenIntro(seen, 'a')).toBe(seen)
	})
})
