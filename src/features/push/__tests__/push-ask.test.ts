import { describe, expect, it } from 'bun:test'
import {
	PUSH_REMIND_AFTER_MS,
	shouldAskForPush,
	shouldRegisterPush,
} from '../utils/push-ask'

const NOW = 1_800_000_000_000

const ready = {
	available: true,
	signedIn: true,
	enabledHere: false,
	preferenceOn: true,
	laterAt: null,
	now: NOW,
}

describe('shouldAskForPush', () => {
	it('asks a signed in person who was never asked', () => {
		expect(shouldAskForPush(ready)).toBe(true)
	})

	it('waits two days after «بعدا» and then asks again', () => {
		const justNow = { ...ready, laterAt: NOW }
		const almost = { ...ready, laterAt: NOW - PUSH_REMIND_AFTER_MS + 1 }
		const due = { ...ready, laterAt: NOW - PUSH_REMIND_AFTER_MS }

		expect(PUSH_REMIND_AFTER_MS).toBe(2 * 24 * 60 * 60 * 1000)
		expect(shouldAskForPush(justNow)).toBe(false)
		expect(shouldAskForPush(almost)).toBe(false)
		expect(shouldAskForPush(due)).toBe(true)
	})

	it('does not ask where push is unavailable, signed out, already on or switched off', () => {
		expect(shouldAskForPush({ ...ready, available: false })).toBe(false)
		expect(shouldAskForPush({ ...ready, signedIn: false })).toBe(false)
		expect(shouldAskForPush({ ...ready, enabledHere: true })).toBe(false)
		expect(shouldAskForPush({ ...ready, preferenceOn: false })).toBe(false)
	})
})

describe('shouldRegisterPush', () => {
	it('registers when push is allowed here and wanted', () => {
		expect(shouldRegisterPush({ ...ready, enabledHere: true })).toBe(true)
	})

	it('does not register without the permissions, without a session or when switched off', () => {
		expect(shouldRegisterPush(ready)).toBe(false)
		expect(shouldRegisterPush({ ...ready, enabledHere: true, signedIn: false })).toBe(
			false
		)
		expect(
			shouldRegisterPush({ ...ready, enabledHere: true, preferenceOn: false })
		).toBe(false)
		expect(
			shouldRegisterPush({ ...ready, enabledHere: true, available: false })
		).toBe(false)
	})
})
