import type { LaunchFailure } from '@/features/widgets/utils/partner-catalog/launch-failure'

type HostPhase =
	| 'idle'
	| 'launching'
	| 'connecting'
	| 'ready'
	| 'parked'
	| 'error'
	| 'unavailable'
	| 'needsSignIn'
	| 'needsConsent'
	| 'needsContact'

export interface HostState {
	phase: HostPhase
	hasLaunch: boolean
}

export type HostEvent =
	| { type: 'seen' }
	| { type: 'launched' }
	| { type: 'failed'; failure: LaunchFailure }
	| { type: 'ready' }
	| { type: 'timeout' }
	| { type: 'retry' }
	| { type: 'evicted' }

export const INITIAL_HOST_STATE: HostState = { phase: 'idle', hasLaunch: false }

const FAILURE_PHASE: Record<LaunchFailure, HostPhase> = {
	NOT_SIGNED_IN: 'needsSignIn',
	CONSENT_REQUIRED: 'needsConsent',
	PHONE_REQUIRED: 'needsContact',
	EMAIL_REQUIRED: 'needsContact',
	EMAIL_OR_PHONE_REQUIRED: 'needsContact',
	WIDGET_NOT_FOUND: 'unavailable',
	UNAVAILABLE: 'error',
	FAILED: 'error',
}

export function hostReducer(state: HostState, event: HostEvent): HostState {
	switch (event.type) {
		case 'seen':
			if (state.phase === 'idle') return { phase: 'launching', hasLaunch: false }
			if (state.phase === 'parked') return { ...state, phase: 'connecting' }
			return state

		case 'launched':
			return state.phase === 'launching'
				? { phase: 'connecting', hasLaunch: true }
				: state

		case 'failed':
			return state.phase === 'launching'
				? { phase: FAILURE_PHASE[event.failure], hasLaunch: false }
				: state

		case 'ready':
			return state.phase === 'connecting' ? { ...state, phase: 'ready' } : state

		case 'timeout':
			return state.phase === 'connecting' ? { ...state, phase: 'error' } : state

		case 'retry':
			return state.phase === 'error' ||
				state.phase === 'needsSignIn' ||
				state.phase === 'needsConsent' ||
				state.phase === 'needsContact'
				? { phase: 'launching', hasLaunch: false }
				: state

		case 'evicted':
			return state.phase === 'connecting' || state.phase === 'ready'
				? { ...state, phase: 'parked' }
				: state
	}
}

export function isFramed(state: HostState): boolean {
	return state.phase === 'connecting' || state.phase === 'ready'
}
