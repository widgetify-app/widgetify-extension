import { describe, expect, it } from 'bun:test'
import { error } from '../i18n/fa/error'
import { translateError } from '../utils/translate-error'

const fallback = error['error.default']

describe('translateError', () => {
	it('falls back to a friendly message when there is nothing to translate', () => {
		expect(translateError(null)).toBe(fallback)
		expect(translateError(undefined)).toBe(fallback)
		expect(translateError({})).toBe(fallback)
		expect(translateError('')).toBe(fallback)
	})

	it('translates a known code, whether it is the error or the server message', () => {
		expect(translateError('NOT_FOUND')).toBe(error['error.notFound'])
		expect(
			translateError({ response: { data: { message: 'USER_NOT_FOUND' } } })
		).toBe(error['error.userNotFound'])
		expect(translateError({ message: 'NOT_FOUND' })).toBe(error['error.notFound'])
	})

	it('prefers the message the server sent over the error object message', () => {
		const err = {
			message: 'NOT_FOUND',
			response: { data: { message: 'USER_NOT_FOUND' } },
		}
		expect(translateError(err)).toBe(error['error.userNotFound'])
	})

	it('shows an unknown message as it is instead of hiding it', () => {
		expect(translateError('SOMETHING_NEW')).toBe('SOMETHING_NEW')
	})

	it('returns one message per field for form validation errors', () => {
		const err = {
			response: {
				data: {
					formValidation: [
						{ property: 'email', message: 'INVALID_EMAIL_FORMAT' },
						{ property: 'name', message: 'NAME_REQUIRED' },
					],
				},
			},
		}
		const result = translateError(err)
		expect(typeof result).toBe('object')
		expect(Object.keys(result as Record<string, string>)).toEqual(['email', 'name'])
	})

	it('translates a known validation message and keeps an unknown one', () => {
		const err = {
			response: {
				data: {
					formValidation: [
						{ property: 'username', message: 'username should not be empty' },
						{ property: 'bio', message: 'something the server added' },
					],
				},
			},
		}
		expect(translateError(err)).toEqual({
			username: error['error.validation.usernameEmpty'],
			bio: 'something the server added',
		})
	})

	it('returns the field map even when only one field failed', () => {
		const err = {
			response: {
				data: {
					formValidation: [
						{ property: 'username', message: 'username does not exist' },
					],
					message: 'NOT_FOUND',
				},
			},
		}
		expect(translateError(err)).toEqual({
			username: error['error.validation.usernameMissing'],
		})
	})

	it('ignores an empty validation list and uses the message instead', () => {
		const err = {
			response: { data: { formValidation: [], message: 'NOT_FOUND' } },
		}
		expect(translateError(err)).toBe(error['error.notFound'])
	})
})
