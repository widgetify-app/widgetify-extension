import { describe, expect, it } from 'bun:test'
import { translateError } from '../utils/translate-error'

const fallback = 'خطایی رخ داده، لطفا دوباره امتحان کن'

describe('translateError', () => {
	it('falls back to a friendly message when there is nothing to translate', () => {
		expect(translateError(null)).toBe(fallback)
		expect(translateError(undefined)).toBe(fallback)
		expect(translateError({})).toBe(fallback)
		expect(translateError('')).toBe(fallback)
	})

	it('translates a known code, whether it is the error or the server message', () => {
		expect(translateError('NOT_FOUND')).toBe('موردی پیدا نشد')
		expect(
			translateError({ response: { data: { message: 'USER_NOT_FOUND' } } })
		).toBe('کاربر پیدا نشد')
		expect(translateError({ message: 'NOT_FOUND' })).toBe('موردی پیدا نشد')
	})

	it('prefers the message the server sent over the error object message', () => {
		const error = {
			message: 'NOT_FOUND',
			response: { data: { message: 'USER_NOT_FOUND' } },
		}
		expect(translateError(error)).toBe('کاربر پیدا نشد')
	})

	it('shows an unknown message as it is instead of hiding it', () => {
		expect(translateError('SOMETHING_NEW')).toBe('SOMETHING_NEW')
	})

	it('returns one message per field for form validation errors', () => {
		const error = {
			response: {
				data: {
					formValidation: [
						{ property: 'email', message: 'INVALID_EMAIL_FORMAT' },
						{ property: 'name', message: 'NAME_REQUIRED' },
					],
				},
			},
		}
		const result = translateError(error)
		expect(typeof result).toBe('object')
		expect(Object.keys(result as Record<string, string>)).toEqual(['email', 'name'])
	})

	it('ignores an empty validation list and uses the message instead', () => {
		const error = {
			response: { data: { formValidation: [], message: 'NOT_FOUND' } },
		}
		expect(translateError(error)).toBe('موردی پیدا نشد')
	})
})
