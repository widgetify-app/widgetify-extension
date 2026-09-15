import { describe, expect, it } from 'bun:test'
import { DEFAULT_TOOLS_TAB, TOOLS_TABS } from '../constants'
import { normalizeToolsTab } from '../utils/normalize-tools-tab'

describe('normalizeToolsTab', () => {
	it('keeps every tab the widget actually offers', () => {
		for (const tab of TOOLS_TABS) {
			expect(normalizeToolsTab(tab.id)).toBe(tab.id)
		}
	})

	it('falls back to the default when nothing is stored', () => {
		expect(normalizeToolsTab(undefined)).toBe(DEFAULT_TOOLS_TAB)
		expect(normalizeToolsTab(null)).toBe(DEFAULT_TOOLS_TAB)
		expect(normalizeToolsTab('')).toBe(DEFAULT_TOOLS_TAB)
	})

	it('rejects a value that is not a tab instead of trusting storage', () => {
		expect(normalizeToolsTab('nonsense')).toBe(DEFAULT_TOOLS_TAB)
		expect(normalizeToolsTab('POMODORO')).toBe(DEFAULT_TOOLS_TAB)
	})
})
