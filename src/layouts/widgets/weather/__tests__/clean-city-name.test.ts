import { describe, expect, it } from 'bun:test'
import { cleanCityName } from '../utils/clean-city-name'

describe('cleanCityName', () => {
	it('drops the county word from a city name', () => {
		expect(cleanCityName('شهرستان کرج')).toBe('کرج')
	})

	it('leaves a plain city name alone', () => {
		expect(cleanCityName('تهران')).toBe('تهران')
	})

	it('removes every occurrence, not just the first', () => {
		expect(cleanCityName('شهرستان آمل شهرستان')).toBe('آمل')
	})

	it('collapses the surrounding spaces it leaves behind', () => {
		expect(cleanCityName('  شهرستان  رشت  ')).toBe('رشت')
	})

	it('returns an empty string for a missing name', () => {
		expect(cleanCityName(undefined)).toBe('')
		expect(cleanCityName(null)).toBe('')
		expect(cleanCityName('')).toBe('')
	})
})
