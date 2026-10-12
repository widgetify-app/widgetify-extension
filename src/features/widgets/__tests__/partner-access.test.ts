import { describe, expect, it } from 'bun:test'
import {
	consentLines,
	contactStepOf,
	needsConsentScreen,
} from '../utils/partner-catalog/partner-access'

describe('needsConsentScreen', () => {
	it('never asks for a widget that reads nothing', () => {
		expect(needsConsentScreen([], 'widget:clock', [])).toBe(false)
		expect(needsConsentScreen([], 'widget:clock', null)).toBe(false)
	})

	it('asks for a widget that reads the account or the profile when the user has not consented', () => {
		expect(needsConsentScreen(['PROFILE'], 'widget:clock', [])).toBe(true)
		expect(needsConsentScreen(['ACCOUNT'], 'widget:clock', ['widget:other'])).toBe(
			true
		)
	})

	it('does not ask again for a widget the user already consented to', () => {
		expect(
			needsConsentScreen(['PROFILE', 'ACCOUNT'], 'widget:clock', [
				'widget:other',
				'widget:clock',
			])
		).toBe(false)
	})

	it('asks when it could not find out, so a failure never skips the screen', () => {
		expect(needsConsentScreen(['PROFILE'], 'widget:clock', null)).toBe(true)
	})

	it('matches the whole key, not a part of it', () => {
		expect(needsConsentScreen(['PROFILE'], 'widget:clock', ['widget:clock-2'])).toBe(
			true
		)
		expect(needsConsentScreen(['PROFILE'], 'widget:clock-2', ['widget:clock'])).toBe(
			true
		)
	})
})

describe('contactStepOf', () => {
	it('asks for nothing when the widget does not read the account', () => {
		expect(contactStepOf([], 'PHONE', null)).toBeNull()
		expect(
			contactStepOf(['PROFILE'], 'EMAIL', { email: null, phone: null })
		).toBeNull()
	})

	it('EMAIL_OR_PHONE wants either contact and asks for a phone first', () => {
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', { phone: '9120000000' })
		).toBeNull()
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', { email: 'a@example.com' })
		).toBeNull()
		expect(contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', {})).toBe('phone')
		expect(contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', null)).toBe('phone')
	})

	it('EMAIL_OR_PHONE accepts an email that is not verified, as the server does', () => {
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', {
				email: 'a@example.com',
				verified: false,
			})
		).toBeNull()
	})

	it('PHONE wants a phone even when the user has an email', () => {
		expect(
			contactStepOf(['ACCOUNT'], 'PHONE', {
				email: 'a@example.com',
				verified: true,
			})
		).toBe('phone')
		expect(contactStepOf(['ACCOUNT'], 'PHONE', { phone: '9120000000' })).toBeNull()
	})

	it('EMAIL wants an email that is verified', () => {
		expect(contactStepOf(['ACCOUNT'], 'EMAIL', { phone: '9120000000' })).toBe('email')
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL', {
				email: 'a@example.com',
				verified: false,
			})
		).toBe('email')
		expect(contactStepOf(['ACCOUNT'], 'EMAIL', { email: 'a@example.com' })).toBe(
			'email'
		)
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL', {
				email: 'a@example.com',
				verified: true,
			})
		).toBeNull()
	})

	it('treats an empty string as a missing contact', () => {
		expect(contactStepOf(['ACCOUNT'], 'PHONE', { phone: '' })).toBe('phone')
		expect(
			contactStepOf(['ACCOUNT'], 'EMAIL_OR_PHONE', { phone: '', email: '' })
		).toBe('phone')
	})
})

describe('consentLines', () => {
	it('lists what the widget will receive, one line per scope', () => {
		expect(consentLines([], 'EMAIL_OR_PHONE')).toEqual([])
		expect(consentLines(['PROFILE'], 'PHONE')).toEqual([
			'widgets.partner.consent.scope.profile',
		])
		expect(consentLines(['PROFILE', 'ACCOUNT'], 'EMAIL_OR_PHONE')).toEqual([
			'widgets.partner.consent.scope.profile',
			'widgets.partner.consent.scope.account',
		])
	})

	it('names the exact contact when the widget asks for one', () => {
		expect(consentLines(['ACCOUNT'], 'PHONE')).toEqual([
			'widgets.partner.consent.scope.phone',
		])
		expect(consentLines(['ACCOUNT'], 'EMAIL')).toEqual([
			'widgets.partner.consent.scope.email',
		])
	})
})
