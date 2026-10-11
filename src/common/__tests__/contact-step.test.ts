import { describe, expect, it } from 'bun:test'
import { contactStepOfError } from '../utils/contact-step'

const failure = (message: unknown) => ({ response: { data: { message } } })

describe('contactStepOfError', () => {
	it('maps the three server codes to the modal to open', () => {
		expect(contactStepOfError(failure('PHONE_REQUIRED'))).toBe('phone')
		expect(contactStepOfError(failure('EMAIL_OR_PHONE_REQUIRED'))).toBe('phone')
		expect(contactStepOfError(failure('EMAIL_REQUIRED'))).toBe('email')
	})

	it('answers nothing for any other error', () => {
		expect(contactStepOfError(failure('CONSENT_REQUIRED'))).toBeNull()
		expect(contactStepOfError(failure(['PHONE_REQUIRED']))).toBeNull()
		expect(contactStepOfError(failure(undefined))).toBeNull()
		expect(contactStepOfError({ response: {} })).toBeNull()
		expect(contactStepOfError(new Error('Network Error'))).toBeNull()
		expect(contactStepOfError(null)).toBeNull()
	})
})
