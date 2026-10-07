import { describe, expect, it } from 'bun:test'
import { isThemeRootSelector } from '../utils/theme-css'

describe('isThemeRootSelector', () => {
	it('accepts the selectors a daisyUI theme is written under', () => {
		expect(
			isThemeRootSelector(
				':root:has(input.theme-controller[value=naazgol]:checked),[data-theme=naazgol]'
			)
		).toBe(true)
		expect(
			isThemeRootSelector(
				':is(:root:has(input.theme-controller[value=naazgol]:checked),[data-theme=naazgol])'
			)
		).toBe(true)
		expect(isThemeRootSelector('[data-theme="naazgol"]')).toBe(true)
		expect(isThemeRootSelector(':root')).toBe(true)
	})

	it('rejects a rule that styles something inside the theme', () => {
		expect(isThemeRootSelector('[data-theme=naazgol] .btn')).toBe(false)
		expect(isThemeRootSelector('body')).toBe(false)
	})
})
