import { describe, expect, it } from 'bun:test'
import {
	FAIR_PING_MS,
	getPingFeedback,
	getPingQuality,
	getPingTextClass,
	GOOD_PING_MS,
} from '../utils/ping-quality'

describe('getPingQuality', () => {
	it('has no opinion when there is no measurement', () => {
		expect(getPingQuality(null)).toBe('unknown')
	})

	it('treats a nonsense negative reading as no measurement', () => {
		expect(getPingQuality(-1)).toBe('unknown')
	})

	it('calls a fast round trip good', () => {
		expect(getPingQuality(0)).toBe('good')
		expect(getPingQuality(GOOD_PING_MS)).toBe('good')
	})

	it('calls the middle band fair', () => {
		expect(getPingQuality(GOOD_PING_MS + 1)).toBe('fair')
		expect(getPingQuality(FAIR_PING_MS)).toBe('fair')
	})

	it('calls anything slower poor', () => {
		expect(getPingQuality(FAIR_PING_MS + 1)).toBe('poor')
		expect(getPingQuality(5000)).toBe('poor')
	})

	it('pins the readings the three sizes used to disagree about', () => {
		expect(getPingQuality(100)).toBe('good')
		expect(getPingQuality(130)).toBe('good')
		expect(getPingQuality(200)).toBe('fair')
		expect(getPingQuality(270)).toBe('fair')
	})

	it('keeps the wording and the colour on the same verdict', () => {
		expect(getPingFeedback(100)).toBe('پینگ شما عالی هست.')
		expect(getPingTextClass(100)).toBe('text-success')

		expect(getPingFeedback(200)).toBe('پینگ شما متوسط است.')
		expect(getPingTextClass(200)).toBe('text-warning')

		expect(getPingFeedback(900)).toBe('پینگ شما ضعیف است.')
		expect(getPingTextClass(900)).toBe('text-error')

		expect(getPingFeedback(null)).toBe('پینگ در دسترس نیست.')
		expect(getPingTextClass(null)).toBe('text-muted')
	})

	it('keeps the bands in order', () => {
		expect(GOOD_PING_MS).toBeLessThan(FAIR_PING_MS)
	})
})
