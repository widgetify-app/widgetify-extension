import { describe, expect, it } from 'bun:test'
import { launchFailureOf } from '../utils/partner-catalog/launch-failure'

describe('launchFailureOf', () => {
	const failure = (status: number, message?: string) => ({
		response: { status, data: { message } },
	})

	it('reads the codes the server answers', () => {
		expect(launchFailureOf(failure(403, 'CONSENT_REQUIRED'))).toBe('CONSENT_REQUIRED')
		expect(launchFailureOf(failure(400, 'PHONE_REQUIRED'))).toBe('PHONE_REQUIRED')
		expect(launchFailureOf(failure(400, 'EMAIL_REQUIRED'))).toBe('EMAIL_REQUIRED')
		expect(launchFailureOf(failure(400, 'EMAIL_OR_PHONE_REQUIRED'))).toBe(
			'EMAIL_OR_PHONE_REQUIRED'
		)
		expect(launchFailureOf(failure(404, 'WIDGET_NOT_FOUND'))).toBe('WIDGET_NOT_FOUND')
	})

	it('reads the status when there is no code', () => {
		expect(launchFailureOf(failure(401))).toBe('NOT_SIGNED_IN')
		expect(launchFailureOf(failure(404))).toBe('WIDGET_NOT_FOUND')
		expect(launchFailureOf(failure(503, 'PARTNER_WIDGETS_UNAVAILABLE'))).toBe(
			'UNAVAILABLE'
		)
		expect(launchFailureOf(failure(500))).toBe('FAILED')
	})

	it('treats a lost connection as unavailable and junk as a failure', () => {
		expect(launchFailureOf(new Error('Network Error'))).toBe('UNAVAILABLE')
		expect(launchFailureOf(null)).toBe('UNAVAILABLE')
		expect(launchFailureOf(failure(400, 'SOMETHING_ELSE'))).toBe('FAILED')
		expect(launchFailureOf({ response: { status: 400, data: null } })).toBe('FAILED')
	})
})
