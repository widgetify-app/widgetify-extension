import { describe, expect, it } from 'bun:test'
import { DEFAULT_YADKAR_TAB, YADKAR_TABS } from '../constants'
import { normalizeYadkarTab } from '../utils/normalize-yadkar-tab'

describe('normalizeYadkarTab', () => {
	it('keeps every known tab as-is', () => {
		for (const tab of YADKAR_TABS) {
			expect(normalizeYadkarTab(tab)).toBe(tab)
		}
	})

	it('migrates the old "rabbit" id to habits', () => {
		expect(normalizeYadkarTab('rabbit')).toBe('habits')
	})

	it('falls back to the default when nothing is stored', () => {
		expect(normalizeYadkarTab(undefined)).toBe(DEFAULT_YADKAR_TAB)
		expect(normalizeYadkarTab(null)).toBe(DEFAULT_YADKAR_TAB)
		expect(normalizeYadkarTab('')).toBe(DEFAULT_YADKAR_TAB)
	})

	it('rejects a value that is not a tab instead of trusting storage', () => {
		expect(normalizeYadkarTab('nonsense')).toBe(DEFAULT_YADKAR_TAB)
		expect(normalizeYadkarTab('TODOS')).toBe(DEFAULT_YADKAR_TAB)
	})
})
