export const PUSH_REMIND_AFTER_MS = 2 * 24 * 60 * 60 * 1000

interface PushState {
	available: boolean
	signedIn: boolean
	enabledHere: boolean
	preferenceOn: boolean
	laterAt: number | null
	now: number
}

export function shouldAskForPush(state: PushState): boolean {
	if (!state.available || !state.signedIn) return false
	if (state.enabledHere || !state.preferenceOn) return false
	if (state.laterAt === null) return true

	return state.now - state.laterAt >= PUSH_REMIND_AFTER_MS
}

export function shouldRegisterPush(state: PushState): boolean {
	return state.available && state.signedIn && state.enabledHere && state.preferenceOn
}
