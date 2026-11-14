interface SnowState {
	enabled: boolean | undefined
	signedIn: boolean
	barOpen: boolean
	reducedMotion: boolean
}

export function shouldShowSnow(state: SnowState): boolean {
	return (
		state.enabled === true && state.signedIn && state.barOpen && !state.reducedMotion
	)
}
