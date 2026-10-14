import { describe, expect, it } from 'bun:test'
import {
	getChangeColorClass,
	normalizeCurrencyColorMode,
} from '../utils/currency-color-mode'

describe('normalizeCurrencyColorMode', () => {
	it('keeps the two known modes', () => {
		expect(normalizeCurrencyColorMode('normal')).toBe('normal')
		expect(normalizeCurrencyColorMode('reverse')).toBe('reverse')
	})

	it('reads anything else, including nothing, as normal', () => {
		for (const value of [null, undefined, '', 'REVERSE', 1, true, {}, []]) {
			expect(normalizeCurrencyColorMode(value)).toBe('normal')
		}
	})
})

describe('getChangeColorClass', () => {
	it('paints a rising price red and a falling one green in the normal mode', () => {
		expect(getChangeColorClass('up', 'normal')).toBe('text-danger')
		expect(getChangeColorClass('down', 'normal')).toBe('text-success')
	})

	it('swaps the two in the reverse mode', () => {
		expect(getChangeColorClass('up', 'reverse')).toBe('text-success')
		expect(getChangeColorClass('down', 'reverse')).toBe('text-danger')
	})
})
