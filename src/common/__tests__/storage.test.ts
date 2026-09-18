import { describe, expect, it } from 'bun:test'

if (typeof (globalThis as any).browser === 'undefined') {
	;(globalThis as any).browser = {
		runtime: {
			getManifest: () => ({ version: '1.0.0' }),
		},
	}
}

const { sanitizeFirefoxStorageValue } = await import('../storage')

describe('sanitizeFirefoxStorageValue', () => {
	it('preserves native boolean values', () => {
		expect(sanitizeFirefoxStorageValue('testKey', true)).toBe(true)
		expect(sanitizeFirefoxStorageValue('testKey', false)).toBe(false)
	})

	it('preserves native number values', () => {
		expect(sanitizeFirefoxStorageValue('testKey', 42)).toBe(42)
		expect(sanitizeFirefoxStorageValue('testKey', 0)).toBe(0)
	})

	it('preserves null and undefined values', () => {
		expect(sanitizeFirefoxStorageValue('testKey', null)).toBeNull()
		expect(sanitizeFirefoxStorageValue('testKey', undefined)).toBeUndefined()
	})

	it('parses JSON stringified objects from legacy Firefox storage', () => {
		const raw = JSON.stringify({ fontFamily: 'Vazir', ui: 'CUSTOM' })
		expect(sanitizeFirefoxStorageValue('appearance', raw)).toEqual({
			fontFamily: 'Vazir',
			ui: 'CUSTOM',
		})
	})

	it('parses JSON stringified arrays from legacy Firefox storage', () => {
		const raw = JSON.stringify(['item-1', 'item-2'])
		expect(sanitizeFirefoxStorageValue('testKey', raw)).toEqual(['item-1', 'item-2'])
	})

	it('unwraps double-serialized JSON strings', () => {
		const doubleSerialized = JSON.stringify(JSON.stringify({ key: 'val' }))
		expect(sanitizeFirefoxStorageValue('testKey', doubleSerialized)).toEqual({
			key: 'val',
		})
	})

	it('leaves normal non-JSON strings intact', () => {
		expect(sanitizeFirefoxStorageValue('testKey', 'plain-text-string')).toBe(
			'plain-text-string'
		)
	})

	it('purges corrupted string-spread numeric keys that cause memory leaks in Firefox', () => {
		const corrupted: Record<string, any> = {
			fontFamily: 'CustomFont',
			contentAlignment: 'center',
			ui: 'CUSTOM',
		}
		// Add hundreds of stringified numeric keys from legacy spread
		for (let i = 0; i < 500; i++) {
			corrupted[String(i)] = 'x'
		}

		const sanitized = sanitizeFirefoxStorageValue<Record<string, any>>(
			'appearance',
			corrupted
		)
		expect(sanitized).toEqual({
			fontFamily: 'CustomFont',
			contentAlignment: 'center',
			ui: 'CUSTOM',
		})
		expect(Object.keys(sanitized)).toEqual(['fontFamily', 'contentAlignment', 'ui'])
	})
})
