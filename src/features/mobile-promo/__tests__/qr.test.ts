import { describe, expect, it } from 'bun:test'
import { MOBILE_PROMO_URL } from '../utils/mobile-promo-url'
import { buildQrMatrix } from '../utils/qr'

describe('buildQrMatrix', () => {
	it('encodes the apps page', () => {
		expect(MOBILE_PROMO_URL).toBe('https://widgetify.ir/apps')
	})

	it('builds a square matrix of 33 modules for the apps page', () => {
		const matrix = buildQrMatrix(MOBILE_PROMO_URL)

		expect(matrix).toHaveLength(33)
		expect(matrix.every((row) => row.length === 33)).toBe(true)
	})

	it('sets the three finder squares at the corners and leaves the fourth empty', () => {
		const matrix = buildQrMatrix(MOBILE_PROMO_URL)
		const last = matrix.length - 1

		expect(matrix[0][0]).toBe(true)
		expect(matrix[0][last]).toBe(true)
		expect(matrix[last][0]).toBe(true)
		expect(matrix[last][last]).toBe(false)
	})

	it('gives the same matrix for the same text and another for other text', () => {
		const first = buildQrMatrix(MOBILE_PROMO_URL)

		expect(buildQrMatrix(MOBILE_PROMO_URL)).toEqual(first)
		expect(buildQrMatrix('https://widgetify.ir/other')).not.toEqual(first)
	})
})
