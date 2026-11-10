import { describe, expect, it } from 'bun:test'
import { MOBILE_PROMO_COOLDOWN_MS, shouldShowMobilePromo } from '../utils/show-rule'

const NOW = 1_800_000_000_000

const ready = {
	signedIn: true,
	profileLoaded: true,
	linked: false,
	modalOpen: false,
	closedAt: undefined,
	now: NOW,
}

describe('shouldShowMobilePromo', () => {
	it('shows to a signed in person who never closed it', () => {
		expect(shouldShowMobilePromo(ready)).toBe(true)
	})

	it('stays hidden while signed out or while the profile is loading', () => {
		expect(shouldShowMobilePromo({ ...ready, signedIn: false })).toBe(false)
		expect(shouldShowMobilePromo({ ...ready, profileLoaded: false })).toBe(false)
	})

	it('stays hidden once the mobile version is linked, even if it was never closed', () => {
		expect(shouldShowMobilePromo({ ...ready, linked: true })).toBe(false)
	})

	it('stays hidden while a modal is open and comes back when it closes', () => {
		expect(shouldShowMobilePromo({ ...ready, modalOpen: true })).toBe(false)
		expect(shouldShowMobilePromo({ ...ready, modalOpen: false })).toBe(true)
	})

	it('waits two days after the close and then shows again', () => {
		const justNow = { ...ready, closedAt: NOW }
		const almost = { ...ready, closedAt: NOW - MOBILE_PROMO_COOLDOWN_MS + 1 }
		const due = { ...ready, closedAt: NOW - MOBILE_PROMO_COOLDOWN_MS }

		expect(MOBILE_PROMO_COOLDOWN_MS).toBe(2 * 24 * 60 * 60 * 1000)
		expect(shouldShowMobilePromo(justNow)).toBe(false)
		expect(shouldShowMobilePromo(almost)).toBe(false)
		expect(shouldShowMobilePromo(due)).toBe(true)
	})

	it('treats a close time in the future as never closed, so a clock change cannot hide it for good', () => {
		expect(
			shouldShowMobilePromo({
				...ready,
				closedAt: NOW + 5 * MOBILE_PROMO_COOLDOWN_MS,
			})
		).toBe(true)
	})
})
