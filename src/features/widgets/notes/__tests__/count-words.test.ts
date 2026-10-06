import { describe, expect, it } from 'bun:test'
import { countWords } from '../utils/count-words'

describe('countWords', () => {
	it('counts Persian words split by spaces and new lines', () => {
		expect(countWords('نون، شیر\nتخم‌مرغ و پنیر')).toBe(5)
	})

	it('keeps a half-spaced word whole', () => {
		expect(countWords('می‌خوام')).toBe(1)
	})

	it('reports zero for an empty or blank note', () => {
		expect(countWords('')).toBe(0)
		expect(countWords('  \n\t ')).toBe(0)
	})
})
