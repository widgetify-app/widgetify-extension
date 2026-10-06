import { describe, expect, it } from 'bun:test'
import { normalizeDotCalendarMeta } from '../utils/normalize-meta'

describe('normalizeDotCalendarMeta', () => {
	it('keeps a stored goal', () => {
		expect(
			normalizeDotCalendarMeta({
				variant: 'goal',
				goalTitle: 'کنکور',
				goalStartDate: '2026-01-01',
				goalEndDate: '2026-06-10',
			})
		).toEqual({
			variant: 'goal',
			goalTitle: 'کنکور',
			goalStartDate: '2026-01-01',
			goalEndDate: '2026-06-10',
		})
	})

	it('trims the title', () => {
		expect(normalizeDotCalendarMeta({ goalTitle: '  سفر  ' }).goalTitle).toBe('سفر')
	})

	it('drops fields of the wrong type instead of crashing on them', () => {
		expect(
			normalizeDotCalendarMeta({ variant: 3, goalTitle: 42, goalEndDate: {} })
		).toEqual({
			variant: 'year',
			goalTitle: '',
			goalStartDate: undefined,
			goalEndDate: undefined,
		})
	})

	it('falls back to the year model when there is no meta', () => {
		expect(normalizeDotCalendarMeta(undefined).variant).toBe('year')
		expect(normalizeDotCalendarMeta(null).variant).toBe('year')
		expect(normalizeDotCalendarMeta('goal').variant).toBe('year')
	})
})
