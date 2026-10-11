import { describe, expect, it } from 'bun:test'
import { consentLines, contactStepOf } from '../utils/partner-catalog/partner-access'

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
