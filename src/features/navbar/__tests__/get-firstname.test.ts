import { describe, expect, it } from 'bun:test'
import { GetUserFirstName } from '../utils/get-firstname'

describe('GetUserFirstName', () => {
	it('takes the first word of a full name', () => {
		expect(GetUserFirstName('علی رضایی')).toBe('علی')
		expect(GetUserFirstName('Sara Jane Miller')).toBe('Sara')
	})

	it('ignores spaces around and between the words', () => {
		expect(GetUserFirstName('   علی    رضایی  ')).toBe('علی')
	})

	it('keeps a single name as it is', () => {
		expect(GetUserFirstName('مهسا')).toBe('مهسا')
	})

	it('is empty when there is no name', () => {
		expect(GetUserFirstName('')).toBe('')
		expect(GetUserFirstName('   ')).toBe('')
	})
})
