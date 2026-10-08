import { describe, expect, it } from 'bun:test'
import { withoutWindow } from '../utils/without-window'

describe('withoutWindow', () => {
	it('drops the app that owns the closed window', () => {
		expect(withoutWindow({ a: 1, b: 2 }, 1)).toEqual({ b: 2 })
	})

	it('leaves the record alone when no app owns the window', () => {
		expect(withoutWindow({ a: 1 }, 9)).toEqual({ a: 1 })
	})
})
