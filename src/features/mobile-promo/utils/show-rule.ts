export const MOBILE_PROMO_COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000

interface MobilePromoState {
	signedIn: boolean
	profileLoaded: boolean
	linked: boolean
	modalOpen: boolean
	closedAt: number | undefined
	now: number
}

export function shouldShowMobilePromo(state: MobilePromoState): boolean {
	if (!state.signedIn || !state.profileLoaded || state.linked) return false
	if (state.modalOpen) return false
	if (state.closedAt === undefined || state.closedAt > state.now) return true

	return state.now - state.closedAt >= MOBILE_PROMO_COOLDOWN_MS
}
