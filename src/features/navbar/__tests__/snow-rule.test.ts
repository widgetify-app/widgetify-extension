import { describe, expect, it } from 'bun:test'
import { shouldShowSnow } from '../utils/snow-rule'

const base = { enabled: true, signedIn: true, barOpen: true, reducedMotion: false }

describe('shouldShowSnow', () => {
	it('shows the snow when the server switch is on for a signed in user with the bar open', () => {
		expect(shouldShowSnow(base)).toBe(true)
	})

	it('stays off when the server switch is off or missing', () => {
		expect(shouldShowSnow({ ...base, enabled: false })).toBe(false)
		expect(shouldShowSnow({ ...base, enabled: undefined })).toBe(false)
	})

	it('stays off for a signed out user', () => {
		expect(shouldShowSnow({ ...base, signedIn: false })).toBe(false)
	})

	it('stays off while the bar is closed, so no canvas runs behind a hidden bar', () => {
		expect(shouldShowSnow({ ...base, barOpen: false })).toBe(false)
	})

	it('stays off when the user or the system wants less motion', () => {
		expect(shouldShowSnow({ ...base, reducedMotion: true })).toBe(false)
	})
})
