import { describe, expect, it } from 'bun:test'
import { COMBO_TABS, DEFAULT_COMBO_TAB } from '../constants'
import { normalizeComboTab } from '../utils/normalize-combo-tab'

describe('normalizeComboTab', () => {
	it('keeps every tab the widget actually offers', () => {
		for (const tab of COMBO_TABS) {
			expect(normalizeComboTab(tab)).toBe(tab)
		}
	})

	it('falls back to the default when nothing is stored', () => {
		expect(normalizeComboTab(undefined)).toBe(DEFAULT_COMBO_TAB)
		expect(normalizeComboTab(null)).toBe(DEFAULT_COMBO_TAB)
		expect(normalizeComboTab('')).toBe(DEFAULT_COMBO_TAB)
	})

	it('rejects a value that is not a tab instead of trusting storage', () => {
		expect(normalizeComboTab('nonsense')).toBe(DEFAULT_COMBO_TAB)
		expect(normalizeComboTab('NEWS')).toBe(DEFAULT_COMBO_TAB)
	})
})
