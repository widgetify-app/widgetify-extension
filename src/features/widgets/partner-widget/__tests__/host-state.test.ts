import { describe, expect, it } from 'bun:test'
import type { LaunchFailure } from '../../utils/partner-catalog/launch-failure'
import { createFrameSlots } from '../utils/frame-slots'
import {
	type HostEvent,
	type HostState,
	INITIAL_HOST_STATE,
	hostReducer,
	isFramed,
} from '../utils/host-state'

function run(events: HostEvent[], from: HostState = INITIAL_HOST_STATE): HostState {
	return events.reduce(hostReducer, from)
}

describe('hostReducer', () => {
	it('walks the happy path: idle, launching, connecting, ready', () => {
		expect(run([{ type: 'seen' }])).toEqual({ phase: 'launching', hasLaunch: false })
		expect(run([{ type: 'seen' }, { type: 'launched' }])).toEqual({
			phase: 'connecting',
			hasLaunch: true,
		})
		expect(run([{ type: 'seen' }, { type: 'launched' }, { type: 'ready' }])).toEqual({
			phase: 'ready',
			hasLaunch: true,
		})
	})

	it('does nothing before the cell is seen', () => {
		for (const type of [
			'launched',
			'ready',
			'timeout',
			'retry',
			'evicted',
		] as const) {
			expect(run([{ type }])).toEqual(INITIAL_HOST_STATE)
		}
	})

	it('maps each launch failure to its screen', () => {
		const expected: Record<LaunchFailure, string> = {
			NOT_SIGNED_IN: 'needsSignIn',
			CONSENT_REQUIRED: 'needsConsent',
			PHONE_REQUIRED: 'needsContact',
			EMAIL_REQUIRED: 'needsContact',
			EMAIL_OR_PHONE_REQUIRED: 'needsContact',
			WIDGET_NOT_FOUND: 'unavailable',
			UNAVAILABLE: 'error',
			FAILED: 'error',
		}

		for (const [failure, phase] of Object.entries(expected)) {
			const state = run([
				{ type: 'seen' },
				{ type: 'failed', failure: failure as LaunchFailure },
			])

			expect(state.phase).toBe(phase as HostState['phase'])
			expect(state.hasLaunch).toBe(false)
		}
	})

	it('ignores a late failure or launch once the state moved on', () => {
		const ready = run([{ type: 'seen' }, { type: 'launched' }, { type: 'ready' }])

		expect(hostReducer(ready, { type: 'failed', failure: 'FAILED' })).toBe(ready)
		expect(hostReducer(ready, { type: 'launched' })).toBe(ready)
	})

	it('turns a silent frame into an error, only while connecting', () => {
		const connecting = run([{ type: 'seen' }, { type: 'launched' }])

		expect(hostReducer(connecting, { type: 'timeout' }).phase).toBe('error')
		expect(hostReducer(INITIAL_HOST_STATE, { type: 'timeout' })).toBe(
			INITIAL_HOST_STATE
		)
	})

	it('retries from an error or a needed step by launching again', () => {
		const phases = ['error', 'needsSignIn', 'needsConsent', 'needsContact'] as const

		for (const phase of phases) {
			expect(hostReducer({ phase, hasLaunch: false }, { type: 'retry' })).toEqual({
				phase: 'launching',
				hasLaunch: false,
			})
		}

		const ready = run([{ type: 'seen' }, { type: 'launched' }, { type: 'ready' }])

		expect(hostReducer(ready, { type: 'retry' })).toBe(ready)
	})

	it('parks an evicted frame and reconnects without a new launch', () => {
		const ready = run([{ type: 'seen' }, { type: 'launched' }, { type: 'ready' }])
		const parked = hostReducer(ready, { type: 'evicted' })

		expect(parked).toEqual({ phase: 'parked', hasLaunch: true })
		expect(isFramed(parked)).toBe(false)
		expect(hostReducer(parked, { type: 'seen' })).toEqual({
			phase: 'connecting',
			hasLaunch: true,
		})
	})

	it('does not park a frame that is not on screen', () => {
		expect(hostReducer(INITIAL_HOST_STATE, { type: 'evicted' })).toBe(
			INITIAL_HOST_STATE
		)
	})

	it('draws the frame only while connecting or ready', () => {
		expect(isFramed({ phase: 'connecting', hasLaunch: true })).toBe(true)
		expect(isFramed({ phase: 'ready', hasLaunch: true })).toBe(true)

		for (const phase of [
			'idle',
			'launching',
			'parked',
			'error',
			'unavailable',
		] as const) {
			expect(isFramed({ phase, hasLaunch: false })).toBe(false)
		}
	})
})

describe('createFrameSlots', () => {
	it('keeps up to the limit and evicts the least recently used idle frame', () => {
		const slots = createFrameSlots(2)
		const evicted: string[] = []

		slots.onEvict((id) => evicted.push(id))
		slots.touch('a')
		slots.touch('b')
		slots.touch('c')

		expect(evicted).toEqual(['a'])
		expect(slots.isLive('a')).toBe(false)
		expect(slots.isLive('b')).toBe(true)
		expect(slots.isLive('c')).toBe(true)
	})

	it('moves a touched frame to the most recent place', () => {
		const slots = createFrameSlots(2)
		const evicted: string[] = []

		slots.onEvict((id) => evicted.push(id))
		slots.touch('a')
		slots.touch('b')
		slots.touch('a')
		slots.touch('c')

		expect(evicted).toEqual(['b'])
	})

	it('never evicts a frame that is on screen', () => {
		const slots = createFrameSlots(1)
		const evicted: string[] = []

		slots.onEvict((id) => evicted.push(id))
		slots.setVisible('a', true)
		slots.touch('a')
		slots.setVisible('b', true)
		slots.touch('b')

		expect(evicted).toEqual([])
		expect(slots.isLive('a')).toBe(true)
		expect(slots.isLive('b')).toBe(true)

		slots.setVisible('a', false)

		expect(evicted).toEqual(['a'])
	})

	it('frees a slot when a frame is released', () => {
		const slots = createFrameSlots(1)
		const evicted: string[] = []

		slots.onEvict((id) => evicted.push(id))
		slots.touch('a')
		slots.release('a')
		slots.touch('b')

		expect(evicted).toEqual([])
		expect(slots.isLive('a')).toBe(false)
	})

	it('stops telling a listener that unsubscribed', () => {
		const slots = createFrameSlots(1)
		const evicted: string[] = []

		const stop = slots.onEvict((id) => evicted.push(id))

		stop()
		slots.touch('a')
		slots.touch('b')

		expect(evicted).toEqual([])
	})
})
